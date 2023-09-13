let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    inciarApp();
});

function inciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente(); // Añade el id del cliente
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto
    mostrarResumen();
}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual'); 
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    //Recorrer los botones, cuando se usa querySelectorAll no se puede usar AddEventListener, solo funciona de manera individual
    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3 ) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        
        if(paso <= pasoInicial) return; {
            paso--;
            botonesPaginador();
        } 
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){

        if(paso >= pasoFinal) return; {
            paso++;
            botonesPaginador();
        }
    })
}

async function consultarAPI() {
    try {
        const url = `${location.origin}/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const {id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const {id} = servicio;
    const {servicios} = cita;

    // Identificar el elemento al que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado y quitarlo
    if(servicios.some( agregado => agregado.id === id)) {
        // Eliminar selección
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregar
        cita.servicios = [...servicios, servicio]; // TODO: Con los tres puntos hago una copia del arreglo servicios 
        divServicio.classList.add('seleccionado');
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        
        const dia = new Date(e.target.value).getUTCDay();

        if([6, 0].includes(dia)) {
            cita.fecha = e.target.value = '';
            mostrarAlerta('Fines de semana no atendemos', 'error', '.formulario'); // TODO: Mostrar la alerta si incluye el número 6 o el 0, referentes a Sábado y Domingo 
        } else {
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];

        if(hora < 8 || hora > 21) {
            cita.hora = e.target.value = '';
            mostrarAlerta('Hora no permitida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    
    const alertaPrevia = document.querySelector('.alerta');
    
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // TODO: Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        setTimeout( () => {
            alerta.remove();
        }, 2000)
    } 
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');
    const alertaPrevia = document.querySelector('.alerta');

    // Limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        return;
    } 

    if(alertaPrevia){
        alertaPrevia.remove();
    }

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = "Resumen de servicios";
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach( servicio => {
        
        const {id, precio, nombre} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    // Calcular el total de los servicios
    const serviciosSeleccionados = servicios.map( servicio => servicio.precio );

    var suma = 0;
    for (var i = 0; i < serviciosSeleccionados.length; i++) {
        suma += parseFloat(serviciosSeleccionados[i]); // convierte el string a base 10 y lo suma
    }
    const totalServicio = suma.toFixed(2);

    const contenedorTotalServicio = document.createElement('DIV');
    contenedorTotalServicio.classList.add('contenedor-total-servicio');

    const total = document.createElement('P');
    total.innerHTML = `<span>Total:</span> $${totalServicio}`;
    
    contenedorTotalServicio.appendChild(total);
    resumen.appendChild(contenedorTotalServicio);

    // Heading para cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = "Resumen de la cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia) );
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-CO', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    // Boton para crear una cita 
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    
    const { id, fecha, hora, servicios } = cita;
    
    const idServicios = servicios.map( servicio => servicio.id ) // TODO: La diferencia entre el map y el foreach, es que el foreach solo itera y el map las coincidencias las coloca en la variable


    const datos = new FormData(); //TODO: Es como el submit de un formulario
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    // console.log([...datos]); // TODO: Con [...datos] nos permite ver lo que tiene adentro el FormData


    try {
        // Peticion hacia la api
        const url = `${location.origin}/api/citas`;

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();

        if(resultado.resultado){

            Swal.fire({
                icon: 'success',
                title: 'Cita creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload(); // TODO: Recarga la página después de 3 seg de haber creado la cita
                }, 2000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }  
}