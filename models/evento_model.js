var mysql = require('mysql');
var config = require('../database/config');


var connection = mysql.createConnection(config);
connection.connect();

var evento = {};
//Modelo para Crear un evento
evento.create = function(data,callback){
    // data = { (Todo lo necesario para crear un evento) }
    if(connection){
        connection.query("INSERT INTO event SET ?",data,function(err,data){
            if(err){
                console.log("Error en la creación de evento: %s",err);
                callback(true,{err:err})
            } else{
                callback(null,data);
            }
        });
    } else {
        callback(true,{err:"no bd conexion"});
    }
};
//Modelo para conseguir todos los eventos ligado a un
evento.getById = function(idevento,callback){
    // idevento = se explica solo
  connection.query("SELECT event.*,teacher.mail,teacher.username FROM event " +
      "LEFT JOIN teacher ON teacher.idteacher = event.idteacher " +
      "WHERE event.idevent = ?",[idevento],function(err,data){
      if(err){
          console.log("Error en la selección por idevento: %s",err);
          callback(true,{err:err});
      } else {
          callback(null,data);
      }
  });
};
//Modelo para conseguir todos los eventos ligado a un
evento.getByOwner = function(idteacher,callback){
    connection.query("SELECT event.*,COALESCE(GROUP_CONCAT(teacher.username,'@@',member.state),'empty') AS attendees,DATE_FORMAT(event.start,'%d-%m-%y %H:%m') AS desde,DATE_FORMAT(event.end,'%d-%m-%y %H:%m') AS hasta FROM event " +
        "LEFT JOIN member ON member.idevent = event.idevent " +
        "LEFT JOIN teacher ON teacher.idteacher = member.idteacher " +
        "WHERE event.idteacher = ? GROUP BY event.idevent",[idteacher],function(err,data){
        if(err){
            console.log("Error en la selección por dueño: %s",err);
            callback(true,{err:err});
        } else {
            data.map(function(idx){
                if(idx.attendees != 'empty'){
                    var aux = idx.attendees.split(',');
                    aux.map(function(att){
                        return att.split('@@');
                    });
                    return aux;
                } else {
                    return idx;
                }
            });
            // console.log(data[0].attendees);
            callback(null,data);
        }
    });
};
//Modelo para conseguir todos los eventos ligado a un
evento.getByAttendee = function(idteacher,callback){
    // idevento = se explica solo
    connection.query("SELECT event.*,teacher.username,DATE_FORMAT(event.start,'%d-%m-%y %H:%m') AS desde,DATE_FORMAT(event.end,'%d-%m-%y %H:%m') AS hasta FROM event " +
        "LEFT JOIN teacher ON teacher.idteacher = event.idteacher " +
        "LEFT JOIN member ON member.idevent = event.idevent " +
        "WHERE member.idteacher = ? AND member.state != '' GROUP BY event.idevent",[idteacher],function(err,data){
        if(err){
            console.log("Error en la selección por asistente: %s",err);
            callback(true,{err:err});
        } else {
            callback(null,data);
        }
    });
};
evento.get_idtag = function(idtags,callback){
  //idtags = [ (Lista con idtags a buscar) ]
    connection.query("SELECT evento.*,GROUP_CONCAT(tag.nomtag) AS tags FROM evento" +
        " RIGHT JOIN (" +
        " SELECT DISTINCT idevento FROM evento_tag" +
        " WHERE evento_tag.idtag IN (?)" +
        " ) AS evnts ON evnts.idevento = evento.idevento" +
        " LEFT JOIN evento_tag ON evento_tag.idevento = evento.idevento" +
        " LEFT JOIN tag ON tag.idtag = evento_tag.idtag" +
        " GROUP BY evento.idevento",[idtags],function(err,data){
        if(err){
            console.log("Error en la selección por idtags: %s",err);
            callback(true,{err:err});
        } else {
            for(var i = 0;i<data.length;i++){
                data[i].tags = data[i].tags.split(',');
            }
            callback(null,data);
        }
    })
};
// Modifica el tipo de un evento
evento.ModifType = function(newType,idevent, callback){
    if(connection){
        var sql = "UPDATE event SET type = ? WHERE idevent = ?";
        connection.query(sql,[newType,idevent],function(err, result){
            if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};

// Modifica el tipo de un evento
evento.setIdgoogle = function(idgoogle,idevent, callback){
    if(connection){
        var sql = "UPDATE event SET idgoogle = ? WHERE idevent = ?";
        connection.query(sql,[idgoogle,idevent],function(err, result){
            if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};
module.exports = evento;