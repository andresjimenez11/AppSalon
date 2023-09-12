<?php 

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController {
    
    public static function index(Router $router) {
        
        isAdmin();

        $fecha = $_GET['fecha'] ?? date('Y-m-d'); // TODO: Obtenemos la fecha de la URL

        $fechas = explode('-', $fecha); // TODO: Separamos el día, mes y año

        if(!checkdate($fechas[1], $fechas[2], $fechas[0])){ // TODO: Validamos que sea correcta la fecha
            header('Location: /404');
        }

        // Consultar la base de datos
        $consulta = "SELECT citas.id, citas.hora, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasServicios ";
        $consulta .= " ON citasServicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasServicios.servicioId ";
        $consulta .= " WHERE fecha = '$fecha' ";
        
        $citas = AdminCita::SQL($consulta);

        $router->render('/admin/index', [
            'nombre' => $_SESSION['nombre'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }

    
}