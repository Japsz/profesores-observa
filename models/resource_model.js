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
      console.log(id);
    var sql = 'SELECT * FROM resource'
    + ' LEFT JOIN teacher ON resource.idteacher = teacher.idteacher'
    + ' WHERE teacher.idteacher=' + connection.escape(id)
    + ' ORDER BY idresource DESC';
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
    var sql = 'SELECT * FROM resource'
    + ' LEFT JOIN teacher ON resource.idteacher = teacher.idteacher '
    + ' WHERE idresource IN (SELECT idresource FROM resource_comment ' 
    + ' WHERE idteacher=' + connection.escape(id) + ' GROUP BY idresource) '
    + ' ORDER BY idresource DESC';
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
    var sql = 'SELECT * FROM review LEFT JOIN resource ' +
        'ON resource.idresource = review.idresourceson ' +
        'WHERE  resource.idteacher = ? ' +
        'ORDER BY idresource DESC';
    connection.query(sql,id, function(err, result){
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
        var sql;
        sql = 'SELECT resource.*, teacher.username, teacher.idteacher FROM resource ' +
              'LEFT JOIN teacher ON resource.idteacher = teacher.idteacher ' +
              'ORDER BY idresource DESC';
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
        var sql = 'SELECT resource.*, teacher.username, teacher.idteacher FROM resource ' +
                  'LEFT JOIN teacher ON resource.idteacher = teacher.idteacher ' +
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
        var sql = 'INSERT INTO resource ' +
            '(idteacher, title, description, text, frontimage) VALUES (?)';
        connection.query(sql, [data], function (err, results){
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

resource_model.new_review = function(data, callback){
    if (connection){
        var sql = 'INSERT INTO review (idresourcedad, idresourceson) ' +
            'VALUES (?)';
        connection.query(sql, [data], function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

//recibe idresourceson
resource_model.get_reviews_by_son = function(data, callback){
    if (connection){
        var sql = 'SELECT * FROM resource ' +
            'WHERE resource.idresource IN ' +
            '(SELECT idresourcedad FROM review ' +
            'WHERE review.idresourceson = (?))';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

//recibe idresourceson
resource_model.get_reviews = function(data, callback){
    if (connection){
        var sql = 'SELECT * FROM resource ' +
            'LEFT JOIN teacher ON teacher.idteacher = resource.idteacher ' +
            'WHERE resource.idresource IN ' +
            '(SELECT idresourceson FROM review ' +
            'WHERE review.idresourcedad = (?))';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

resource_model.edit_resource = function(data, callback){
    if (connection){
        var sql =   'UPDATE resource ' +
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
        var sql = 'DELETE FROM resource_tag WHERE idresource = ?';
        connection.query(sql, data, function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(data, results);
        });
    }
};

//idresource, filename
resource_model.new_file = function(data, callback){
    if (connection){
        var  sql = 'INSERT INTO file (idresource, filename) VALUES (?)';
        connection.query(sql, [data], function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};

//idresource
resource_model.get_files = function(data, callback){
    if (connection){
        var sql = 'SELECT * FROM file WHERE idresource = (?)';
        connection.query(sql, [data],function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};

//state, idresource
resource_model.change_state = function (data, callback){
    if (connection){
        var sql = 'UPDATE resource ' +
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

//--- TAG SECTION ---

//Recibe solo un tag
resource_model.new_tag = function(data, callback){
    if (connection){
        var sql = 'INSERT INTO tag (tag, type) VALUES (?)';
        connection.query(sql, [data], function (err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            else return callback(null, results);
        });
    }
};


//recibe data = [idresource, tag, type]
resource_model.new_resource_tag = function(data, callback){
    if (connection){
        var sql = 'INSERT INTO resource_tag (idresource, idtag) VALUES (?)';
        resource_model.get_tag(data[1], function (err, results) {
            if (results.length == 0){
                resource_model.new_tag([data[1],data[2]], function (err, results) {
                    var data2 = [data[0] ,results.insertId];
                    connection.query(sql, [data2], function (err, results) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        else return callback(null, results);
                    });
                });
            } else {
                var data2 = [data[0], results[0].idtag];
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
        var sql = 'SELECT resource_tag.idresource, tag.tag, tag.type FROM resource_tag ' +
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
        var sql = "SELECT * FROM tag WHERE tag.tag LIKE '%"+data+"%'";
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

resource_model.get_tags_type = function(data, callback){
    if (connection){
        var sql = "SELECT tag.tag, COUNT(tag.tag) AS count FROM resource_tag " +
            "LEFT JOIN tag ON resource_tag.idtag = tag.idtag " +
            "WHERE tag.type = 'type' " +
            "GROUP BY tag.tag";
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


//idteacher, idresource, score
resource_model.score = function(data, callback){
    if (connection){
        resource_model.get_score([data[0],data[1]], function (err, results) {
            var sql;
            if (results.length > 0){
                sql = 'UPDATE resource_score ' +
                    'SET score = (?) ' +
                    'WHERE idresource = (?) AND idteacher = (?)';
                data = [data[2], data[1], data[0]];
            } else {
                sql = 'INSERT INTO resource_score (idteacher, idresource, score) ' +
                    'VALUES (?)';
                data = [data];
            }
            console.log(data);
            connection.query(sql, data, function (err, results) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                else {
                    return callback(err, results);
                }
            });
        })
    }
};

resource_model.get_score = function(data, callback){
    if (connection){
        var sql = "SELECT * FROM resource_score WHERE idteacher = ? AND idresource = ?";
        connection.query(sql, data, function (err, results) {
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

resource_model.get_a_score = function(data, callback){
    if (connection){
        var sql = "SELECT COUNT(idresource) AS count, SUM(score) AS sum, idresource " +
            "FROM resource_score WHERE idresource = ?";
        connection.query(sql, data, function (err, results) {
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

resource_model.get_scores = function(data, callback){
    if (connection){
        var sql = "SELECT COUNT(idresource) AS count, SUM(score) AS sum, idresource " +
            "FROM resource_score GROUP BY idresource";
        connection.query(sql, data, function (err, results) {
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





//Recibe un array de elementos seleccionados en el filtro y algun texto
resource_model.filter = function(data, callback){
    if(connection){
        var sql = "SELECT resource.*, teacher.username, teacher.idteacher FROM resource"
        + " LEFT JOIN teacher ON resource.idteacher = teacher.idteacher"
        + " WHERE resource.title LIKE '%" + data.filter + "%'";
    	var tags = JSON.parse(data.tags);
    	var suport = JSON.parse(data.suport);
    	var date = JSON.parse(data.date);
        var star = JSON.parse(data.star);
        //Filtra tags
        if(tags.length > 0){
        	var where2 = " AND resource.idresource IN (SELECT resource_tag.idresource FROM tag LEFT JOIN resource_tag ON tag.idtag=resource_tag.idtag WHERE ("; //Filtra tags(tipo y area)
	        for(var i=0; i<tags.length; i++){
	        	where2 += "tag.tag LIKE '%" + tags[i] + "%'";
	        	if(i + 1 != tags.length) {
	        		where2 += " OR ";
	        	}
	        }
	        sql += where2 + "))";
        }
        //Filtra soporte/tipo de archivo
        if(suport.length > 0){
		    var where3 = " AND resource.idresource IN (SELECT file.idresource FROM file WHERE (";
	        for(var i=0; i<suport.length; i++){
	        	var sup = suport[i].split(" ");
	        	console.log(sup);
	        	for(var j=0; j<sup.length; j++){
	        		where3 += "file.filename LIKE '%" + sup[j] + "'";
		        	if(j + 1 != sup.length) {
				        where3 += " OR ";
		        	}
	        	}
	        	if(i + 1 != suport.length) {
			        where3 += " OR ";
	        	}
	        }
	        sql += where3 + "))";
        }
        //Filtra fechas
        if(date.length > 0){
		    var where4 = " AND (";
	        for(var i=0; i<date.length; i++){
		        where4 += "resource.date LIKE '" + date[i] + "%'";
	        	if(i + 1 != date.length) {
			        where4 += " OR ";
	        	}
	        }
	        sql += where4 + ")";
        }
        if(star > 0){
            console.log("funciona");
            sql += " AND resource.idresource IN (SELECT rs.idresource FROM resource_score as rs GROUP BY rs.idresource HAVING FLOOR(AVG(rs.score)) = " + star + ")";
        }
        console.log(sql);
        connection.query(sql, function(err, results) {
            if(err) {
                console.log(err);
                throw err;
            }
            else {
                return callback(null, results);
            }
        });
    }
};

module.exports = resource_model;
