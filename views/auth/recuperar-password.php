<h1 class="nombre-pagina">Recuperar Password</h1>
<p class="descripcion-pagina">Ingresa nueva password</p>

<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<?php if($error) return; ?>

<form class="formulario" method="POST"> <!-- TODO: Se debe eliminar el action del formulario para que no borre el token de la URL -->
    <div class="campo">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa Tu Nueva Password"
        />
    </div>

    <input class="boton" type="submit" value="Guardar Nuevo Password">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
</div>