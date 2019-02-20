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
      } else{
        //devolvemos la última id insertada
        callback(null, result);
      }
    });
  }
};

//Funcion que retorna la info de un teacher segun mail
teacher_model.show_teacher_by_mail = function(mail, callback){
  if(connection){
    var sql = 'SELECT * FROM teacher WHERE mail=' + connection.escape(mail);
    connection.query(sql, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos el usuario
        callback(null, result);
      }
    });
  }
};

//Funcion que retorna la info de un teacher segun nombre y contraseña
teacher_model.show_teacher_by_name = function(data, callback){
  if(connection){
    var sql = 'SELECT * FROM teacher WHERE (username = ? OR name = ?) AND password = ?';
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

//Funcion que actualiza la información del usuario
teacher_model.update_teacher = function(data, callback){
  if(connection){
    var sql = 'UPDATE teacher SET ? WHERE idteacher=' + connection.escape(data.idteacher);
    connection.query(sql, data, function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos la última id actualizada
        callback(null, result);
      }
    });
  }
};

// Crea un usuario teacher
teacher_model.create = function(data,callback){
  if(connection){
    connection.query("INSERT INTO teacher SET ?", data, function(err,rows){
      if(err){
        console.log("Error al insertar MYSQL: %s",err);
        callback(true,err);
      }
      callback(null,rows);
    });
  } else {
    callback(true,"");
  }
};

//Funcion que agrega una pregunta y respuesta para la inscripcion
teacher_model.add_questionary = function(data, callback){
  if(connection){
    var sql = 'INSERT INTO questionary (idteacher, question, answer) VALUES ?';
    connection.query(sql, [data], function(err, result){
      if(err){
        throw err;
      } else{
        //devolvemos la última id insertada
        callback(null,{"insertId" : result.insertId});
      }
    });
  }
};


// Checkea si existe el mail en la bd
teacher_model.check_email = function(email,callback){
  if(connection){
    connection.query("SELECT idteacher FROM teacher WHERE mail = ?", [email], function(err,rows){
      if(err){
        console.log("Error Select MYSQL: %s",err);
        callback(true,"Error al buscar MYSQL");
      } else {
        if(rows.length){
            callback(null,true);
        } else callback(null,false);
      }
    });
  } else {
    callback(true,"");
  }
};

// Actualiza el campo valid un profesor
// Params idteacher, nro valid
/* Valid:
  0: solicitando inscripcion 
  1: usuario validado y con acceso al sistema
  2: usuario inhabilitado, sin acceso al sistema */
teacher_model.update_valid = function(data, callback){
  if(connection){
    var sql = 'UPDATE teacher SET ? WHERE idteacher=' + connection.escape(data.idteacher);
    connection.query(sql, data, function(err, result){
      if(err) {
        throw err;
      } else {
        callback(null, result);
      }
    });
  }
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = teacher_model;

