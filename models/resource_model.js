//Toda funcion deberia recibir data y retornar un arreglo con resultados.
//llamamos al paquete mysql
var mysql = require('mysql');
//creamos la conexion a nuestra base de datos
var config = require('../database/config');
var connection = mysql.createConnection(config);

//creamos un objeto
var resource_model = {};

//--- RESOURCE SECTION ---
//Query obtener todos los recursos
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
//Query obtener un recurso segun data = idresource
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

resource_model.edit_resource = function(data, callback){
    if (connection){
        let sql =   'UPDATE resource ' +
                    'SET title = ? , description = ? ' +
                    'WHERE idresource = ?';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};


resource_model.delete_resource_tag = function(data, callback){
    if(connection){
        let sql = 'DELETE FROM resource_tag WHERE idresource = ?';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

//TODO new_review

resource_model.new_file = function(data, callback){
    if (connection){
        let  sql = 'INSERT INTO file (idresource, filename) VALUES (?)';
        connection.query(sql, [data], function (err, results) {
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


//recibe data = [idresource, tag]
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
resource_model.get_tag_idresources = function(idresource, callback){
    if (connection){
        let sql = 'SELECT resource_tag.idresource, tag.tag FROM resource_tag ' +
            'LEFT JOIN tag ON resource_tag.idtag = tag.idtag ' +
            'WHERE resource_tag.idresource IN (?) ' +
            'ORDER BY resource_tag.idresource DESC';
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

//state, idresource
resource_model.change_state = function (data, callback){
  if (connection){
      sql = 'UPDATE resource ' +
          'SET state = ? ' +
          'WHERE idresource = ?';
      connection.query(sql,data, function (err, results) {
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

module.exports = resource_model;
