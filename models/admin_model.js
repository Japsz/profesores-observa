//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

var admin_model = {};

//Funcion que retorna la info de un admin segun username y contraseña
admin_model.show_admin_by_name = function(data, callback){
  if(connection){
    var sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
    connection.query(sql, data, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos la última id insertada
        callback(null, result);
      }
    });
  }
};

// Inserta un profesor nuevo
admin_model.create = function(data,callback){
  if(connection){
    connection.query("INSERT INTO teacher SET ?",data,function(err,rows){
      if(err) {
        throw err;
      } else {
        callback(null,{msg: "hola"});
      }
    });
  } else {
    callback(true,{msg: "hola"});
  }
};

// Retorna los usuarios que solicitan inscripcion
admin_model.valid_inscription = function(data, callback){
  if(connection){
    var sql = "SELECT teacher.idteacher, teacher.mail, teacher.rut, questionary.question, questionary.answer FROM questionary"
    + " LEFT JOIN teacher ON teacher.idteacher=questionary.idteacher"
    + " WHERE teacher.valid=0 ORDER BY teacher.idteacher";
    connection.query(sql,data,function(err, result){
      if(err){
        throw err;
      } else {
        callback(null, result);
      }
    });
  }
};

module.exports = admin_model;