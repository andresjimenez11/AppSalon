<h1 class="nombre-pagina">Olvide la contraseña</h1>
<p class="descripcion-pagina">Recupera tu contraseña con el email registrado</p>

<?php 
include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="formulario" method="POST" action="/olvide">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu email"
        />
    </div>

    <input class="boton" type="submit" value="Enviar Código">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
</div>