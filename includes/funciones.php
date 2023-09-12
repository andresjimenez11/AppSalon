<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo) : bool {

    if($actual !== $proximo) {
        return true;
    } 
    return false;
}

// Función que revisa si el usuario está autenticado (VOID significa que no va a retornar nada)
function isAuth() : void {
    if(!isset($_SESSION['login'])){
        header(('Location: /'));
    }
}

// Función para saber si un usuario es Admin
function isAdmin() : void {

    if(!isset($_SESSION['admin']) && !isset($_SESSION['login'])){
        header(('Location: /'));
    } else if(!isset($_SESSION['admin']) && isset($_SESSION['login'])) {
        header('Location: /cita');
    }
}