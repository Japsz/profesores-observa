//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

//creamos un objeto
var teacher_model = {};

//Funcion que retorna la info de un teacher segun idteacher
teacher_model.show_teacher = function(id, callback){
    if(connection){
        var sql = 'SELECT * FROM teacher WHERE idteacher=' + connection.escape(id);
        connection.query(sql, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos la última id insertada
                callback(null, result);
            }
        });
    }
};

//Funcion que retorna la info de un teacher segun nombre y contraseña
teacher_model.show_teacher_by_name = function(data, callback){
    if(connection){
        var sql = 'SELECT * FROM teacher WHERE username = ? AND password = ?';
        connection.query(sql, data, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos la última id insertada
                callback(null, result);
            }
        });
    }
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = teacher_model;