<?php

namespace Model;

class Usuario extends ActiveRecord {
    
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'confirmado', 'token'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    public $telefono;
    public $admin;
    public $confirmado;
    public $token;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido = $args['apellido'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->admin = $args['admin'] ?? '0';
        $this->confirmado = $args['confirmado'] ?? '0';
        $this->token = $args['token'] ?? '';
    }

    //Mensajes de validación
    public function validarNuevaCuenta() {
        if(!$this->nombre) {
            self::$alertas['error'][] = "Debes añadir un nombre";
        }

        if(!$this->apellido) {
            self::$alertas['error'][] = "Debes añadir un apellido";
        }

        if(!$this->email) {
            self::$alertas['error'][] = "Debes añadir un email";
        }

        if(!$this->telefono) {
            self::$alertas['error'][] = "Debes añadir un telefono";
        }
        
        if(!preg_match('/[0-9]{10}/', $this->telefono)) { // TODO: Sirve para buscar patrones dentro de un texto
            self::$alertas['error'][] = "Formato no válido";
        }

        if(!$this->password) {
            self::$alertas['error'][] = "Debes añadir un password";
        }

        if(strlen($this->password) < 8) {
            self::$alertas['error'][] = "El password debe tener mínimo 8 carácteres";
        }
        return self::$alertas;
    }

    public function validarPassword() {
       if(!$this->password) {
            self::$alertas['error'][] = 'El Password Es Obligatorio';
       }

       if(strlen($this->password) < 8){
            self::$alertas['error'][] = 'El Password Debe Tener Al Menos 8 Carácteres';
       }
       return self::$alertas;
    }

    //Revisa si el usuario ya existe
    public function existeUsuario() {
        $query = "SELECT * FROM " . self::$tabla . " WHERE email = '" . $this->email . "' LIMIT 1";

        $resultado = self::$db->query($query);

        if($resultado->num_rows) {
            self::$alertas['error'][] = 'El usuario ya está registrado';
        }
        return $resultado;
    }

    public function hashPassword() {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function crearToken() {
        $this->token = uniqid(); // TODO: Función de PHP para crear ID únicos, sirve para Tokens
    }

    public function validarLogin() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password es Obligatorio';
        }
        return self::$alertas;
    }

    public function validarEmail() {
        if(!$this->email) {
            self::$alertas['error'][] = 'El Email es Obligatorio';
        }
        return self::$alertas;
    }

    public function comprobarPasswordAndVerificado($password){
        
        $resultado = password_verify($password, $this->password);

        if(!$resultado || !$this->confirmado){
            self::$alertas['error'][] = 'Password Incorrecto o Tu Cuenta No Ha Sido Confirmada';
        } else {
            return true;
        }
    }
}