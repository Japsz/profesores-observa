//Todas las funciones que llaman a la BD usadas por el controlador resource van aqui.
//Toda funcion deberia recibir data y retornar un arreglo con resultados.
//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

//creamos un objeto
var resource_model = {};

//--- RESOURCE SECTION ---

resource_model.get_resources = function(data, callback){
    if (connection){
        let sql;
        sql = 'SELECT * FROM resource ' +
              'ORDER BY idresource DESC';
        //TODO Como obtendre todos los tags de aca??
        connection.query(sql,data, function (err,results) {
            if (err){
                console.log(err);
                throw err;
            }
            else return callback(null,results);
        });
    }
};

resource_model.get_resource = function(data, callback){
    if (connection){
        let sql = 'SELECT * FROM resource ' +
                  'WHERE idresource = ?';
        connection.query(sql, data, function (err, results) {
            if (err){
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};

resource_model.new_resource = function(data, callback){
    if (connection){
        let sql = 'INSERT INTO resource ' +
            '(idteacher, title, description, text) VALUES (?)';
        connection.query(sql, [data], function (err, results){
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        })
    }
};

resource_model.new_file = function(data, callback){
    if (connection){
        let  sql = 'INSERT INTO file (idresource, filename) VALUES (?)';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};

//--- TAG SECTION ---

//Recibe solo un tag
resource_model.new_tag = function(data, callback){
    if (connection){
        let sql = 'INSERT INTO tag (tag) VALUES (?)';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};

//Recibe idresource, tagtext
//data = [idresource, tag]
resource_model.new_resource_tag = function(data, callback){
    if (connection){
        let sql = 'INSERT INTO resource_tag (idresource, idtag) VALUES (?)';
        resource_model.get_tag(data[1], function (err, results) {
            if (results.length == 0){
                resource_model.new_tag(data[1], function (err, results) {
                    let data2 = [data[0] ,results.insertId];
                    connection.query(sql, [data2], function (err, results) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        else return callback(null, results);
                    });
                });
            } else {
                let data2 = [data[0], results[0].idtag];
                connection.query(sql, [data2], function (err, results) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    else return callback(null, results);
                });
            }
        });
    }
};

//Recibe una lista de idresources. Puede ser 1 elemento.
resource_model.get_tag_idresource = function(idresource, callback){
    if (connection){
        let sql = 'SELECT resource_tag.idresource, tag.tag FROM resource_tag ' +
            'LEFT JOIN tag ON resource_tag.idtag = tag.idtag ' +
            'WHERE resource_tag.idresource IN (?)';
        connection.query(sql, [idresource], function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                return callback(err, results);
            }
        });
    }
};


//data = tag
resource_model.get_tag = function(data, callback){
    if (connection) {
        let sql = "SELECT * FROM tag WHERE tag.tag LIKE '%"+data+"%'";
        connection.query(sql, 0, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else {
                return callback(err, results);
            }
        });
    }
};

//idresource
resource_model.deactivate = function (data, callback){
  if (connection){
      sql = 'UPDATE resource ' +
          'SET state = (?) ' +
          'WHERE idresource = (?)';
      if (data == 'Activo'){
          connection.query(sql,['Desactivado, data'], function (err, results) {
              if (err) {
                  console.log(err);
                  throw err;
              }
              else {
                  return callback(err, results);
              }
          });
      }
  }
};

module.exports = resource_model;
