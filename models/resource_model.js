//Todas las funciones que llaman a la BD usadas por el controlador resource van aqui.
//Toda funcion deberia recibir el req y retornar un arreglo con resultados.
//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

//creamos un objeto
var resource_model = {};

//Funcion que retorna los recursos de un teacher
resource_model.resources_by_teacher = function(id, callback){
  if(connection){
    var sql = 'SELECT * FROM resource WHERE idteacher=' + connection.escape(id) + ' ORDER BY date DESC';
    connection.query(sql, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos sus recursos
        callback(null, result);
      }
    });
  }
};

//Funcion que retorna los recursos en los que ha comentado un teacher
resource_model.resources_by_comment_teacher = function(id, callback){
  if(connection){
    var sql = 'SELECT * FROM resource WHERE idresource IN (SELECT idresource FROM resource_comment ' 
    + 'WHERE idteacher=' + connection.escape(id) + ' GROUP BY idresource) ORDER BY date DESC';
    connection.query(sql, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos sus recursos
        callback(null, result);
      }
    });
  }
};

//Funcion que retorna los recursos en los que ha comentado un teacher
resource_model.resources_by_review = function(id, callback){
  if(connection){
    var sql = 'SELECT * FROM resource WHERE idresource IN (SELECT review.idroot FROM resource'
    + ' LEFT JOIN review ON review.idresourceson=resource.idresource'
    + ' WHERE resource.idteacher=' + connection.escape(id) + ')';
    connection.query(sql, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos sus recursos
        callback(null, result);
      }
    });
  }
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = resource_model;

