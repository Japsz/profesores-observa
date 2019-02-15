//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

//creamos un objeto
var comment_model = {};

//Funcion que agrega un comentario
comment_model.add_comment = function(data, callback){
    if(connection){
        var sql = 'INSERT INTO resource_comment SET ?';
        connection.query(sql, data, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos la última id insertada
                callback(null,{"insertId" : result.insertId});
            }
        });
    }
};

//Funcion que agrega una puntuación en un comentario
comment_model.comment_point = function(data, callback){
    if(connection){
        var sql = 'INSERT INTO comment_point SET ?';
        connection.query(sql, data, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos la última id insertada
                callback(null,{"insertId" : result.insertId});
            }
        });
    }
};

//Funcion que elimina comentario
comment_model.remove = function(data, callback){
    if(connection){
        var sql = 'DELETE FROM resource_comment WHERE idcomment=' + connection.escape(data);
        connection.query(sql, data, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos la última id insertada
                callback(null,{"insertId" : result.insertId});
            }
        });
    }
};

//Funcion que muestra los comentarios de un recurso
comment_model.show_comments = function(data, callback){
    if(connection){
        var sql = "SELECT resource_comment.*, teacher.username, "
        + " (SELECT COALESCE(SUM(cp.point),0) FROM comment_point as cp WHERE cp.idcomment=resource_comment.idcomment) as points,"
       	+ " (SELECT COALESCE(cp.point,0) FROM comment_point as cp WHERE cp.idteacher=? AND cp.idcomment=resource_comment.idcomment) as point_teacher FROM resource_comment"
       	+ " LEFT JOIN teacher ON resource_comment.idteacher = teacher.idteacher"
       	+ " WHERE resource_comment.idresource = ?"
       	+ " ORDER BY resource_comment.date DESC";
        connection.query(sql, data, function(err, result){
            if(err){
                throw err;
            }
            else{
                //devolvemos los datos solicitados
                callback(null, result);
            }
        });
    }
};

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = comment_model;