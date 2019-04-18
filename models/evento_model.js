var mysql = require('mysql');
var config = require('../database/config');
var gmodel = require('../Gmodel/event_model');

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
//Modelo para conseguir todos los eventos
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
    console.log('idteacher=' + idteacher);
    gmodel.listEvents({
        calendarId: 'primary',
        privateExtendedProperty: ['idteacher=' + idteacher],
        showDeleted: true,
        orderBy: 'startTime',
        singleEvents:true
        },function(err,rows){
            console.log("?");
            if(err){
                console.log(rows);
                callback(err,{data:rows});
            } else {
                console.log(rows);
                if(rows.length){
                    var ideventList = [];
                    for(var i = 0;i<rows.length;i++){
                        console.log(rows[i].idevent);
                        if(rows[i].idevent != 'undefined'){
                            //rows[i].members = members;
                            //console.log(rows[i].members);
                            ideventList.push(rows[i].idevent);
                        }
                    };
                    evento.getMemberInfo(ideventList,rows,function(err,rows){
                        if(err){
                            console.log(err);
                            console.log(rows);
                            callback(true,rows)
                        } else {
                            console.log(rows);
                            callback(null,rows);
                        }
                    });
                } else {
                    callback(null,rows);
                }
            }
    });
    console.log(gmodel);
};
evento.getByProposed = function(idteacher,callback){
    gmodel.listEvents({
        calendarId:'primary',
        privateExtendedProperty: "idteacher=" + idteacher
    },function (err,rows) {
        if(err){
            console.log(err);
            callback(err,rows);
        } else {
            console.log(rows);
            evento.getAttendees(rows,function(err,attendees){
                if(err){
                    console.log(err);
                    callback(err,rows);
                } else {
                    console.log(attendees);
                    callback(null,rows);
                }
            });
        }
    });
};
//Funcion para conseguir todos los eventos a los cuales (si o quizas) asista el profesor
evento.getByAttendee = function(idteacher,callback){
    // idevento = se explica solo
    connection.query("SELECT event.*,teacher.username,DATE_FORMAT(event.start,'%d-%m-%y %H:%m') AS desde,DATE_FORMAT(event.end,'%d-%m-%y %H:%m') AS hasta FROM event " +
        "LEFT JOIN teacher ON teacher.idteacher = event.idteacher " +
        "LEFT JOIN member ON member.idevent = event.idevent " +
        "WHERE member.idteacher = ? GROUP BY event.idevent ORDER BY member.state DESC",[idteacher],function(err,data){
        if(err){
            console.log("Error en la selección por asistente: %s",err);
            callback(true,{err:err});
        } else {
            callback(null,data);
        }
    });
};
//Modelo para conseguir la info de los posibles asistentes a un evento
evento.getAttendees = function(idevent,callback){
    console.log(typeof idevent);
    connection.query("SELECT teacher.perfil_image,teacher.username,teacher.idteacher,member.state FROM member " +
        "LEFT JOIN teacher ON teacher.idteacher = member.idteacher " +
        "WHERE member.idevent IN (?) GROUP BY teacher.idteacher",[idevent],function(err,data){
        if(err){
            console.log("Error en la selección por asistente: %s",err);
            callback(true,{err:err});
        } else {
            callback(null,data);
        }
    });
};
evento.getMemberInfo = function(ideventList,objArray,callback){
    if(connection){
        if(ideventList.length){
            connection.query("SELECT event.idevent,teacher.username,teacher.idteacher,COALESCE(memtokens.mtoken,NULL) AS mtoken FROM event " +
                "LEFT JOIN  (SELECT event.idevent,GROUP_CONCAT(teacher.perfil_image,'@@',teacher.username,'@@',teacher.idteacher,'@@',member.state) AS mtoken FROM event " +
                "LEFT JOIN member ON member.idevent = event.idevent " +
                "LEFT JOIN teacher ON teacher.idteacher = member.idteacher " +
                "GROUP BY event.idevent) AS memtokens ON memtokens.idevent = event.idevent " +
                "LEFT JOIN teacher ON teacher.idteacher = event.idteacher " +
                "WHERE event.idevent IN ( ? ) GROUP BY event.idevent",[ideventList],function(err,rows){
                if(err){
                    console.log(err);
                    callback(err,"Error");
                } else {
                    var mList;
                    var confList = [];
                    var maybeList = [];
                    var flag = false;
                    if(rows.length){
                        for(var j = 0;j<objArray.length;j++){
                            for(var i = 0;i<rows.length;i++){
                                if(parseInt(objArray[j].idevent) == parseInt(rows[i].idevent)){
                                    if(rows[i].mtoken != null){
                                        objArray[j].mtoken = rows[i].mtoken;
                                        mList = rows[i].mtoken.split(",");
                                        mList.map(function(member){
                                            member = member.split('@@');
                                            if(member[3] == "yes"){
                                                confList.push({
                                                    idteacher: member[2],
                                                    perfil_image: member[0],
                                                    username: member[1]
                                                });
                                            } else {
                                                maybeList.push({
                                                    idteacher: member[2],
                                                    perfil_image: member[0],
                                                    username: member[1]
                                                });
                                            }
                                        });
                                    } else {
                                        confList = [];
                                        maybeList = [];
                                        objArray[j].mtoken = "";
                                    }
                                    objArray[j].attendees = {
                                        confirmed: confList,
                                        maybe: maybeList
                                    };
                                    objArray[j].username = rows[i].username;
                                    confList = [];
                                    maybeList = [];
                                    flag = true;
                                    break;
                                }
                            }
                            if(!flag){
                                objArray[j].attendees = {
                                    confirmed: [],
                                    maybe: []
                                };
                                objArray[j].mtoken = "";
                            }
                            flag = false;
                        }
                    } else {
                        for(var j = 0;j<objArray.length;j++){
                            objArray[j].attendees = {
                                confirmed: [],
                                maybe: []
                            };
                            objArray[j].mtoken = "";
                        }
                    }
                    callback(null,objArray);
                }
            });
        } else {
            for(var j = 0;j<objArray.length;j++){
                objArray[j].attendees = {
                    confirmed: [],
                    maybe: []
                };
                objArray[j].mtoken = "";
            }
            callback(null,objArray);
        }

    } else {
        callback(true,"Not connected to BD");
    }
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

// Setea el id de google correspondiente a un evento

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

// Revisa si existe un evento con un idgoogle específico.
evento.getByIdgoogle = function(idgoogle, callback){
    if(connection){
        var sql = "SELECT * FROM event WHERE idgoogle = ?";
        connection.query(sql,[idgoogle],function(err, result){
            if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};
// Entrega la respuesta de un profesor a un evento (siesque tiene)
evento.checkMember = function(idteacher,idevent, callback){
    if(connection){
        var sql = "SELECT * FROM member WHERE idteacher = ? AND idevent = ?";
        connection.query(sql,[idteacher,idevent],function(err, result){
            if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};
// Modifica el estado de respuesta
evento.setMemberState = function(state,idteacher,idevent,insert, callback){
    if(connection){
        var sql = ["INSERT INTO member SET ?","UPDATE member SET state = ? WHERE idteacher = ? AND idevent = ?"];
        //insert = 1|0 segun la query que se tiene que hacer.
        if(insert) var data = [state,idteacher, idevent];
        else var data = {idteacher:idteacher, idevent:idevent, state:state};
        console.log(sql[insert]);
        console.log(data);
        connection.query(sql[insert],data,function(err, result){
                if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};
// Elimina la respuesta a un evento de un profesor.
evento.removeMember = function(idteacher,idevent, callback){
    if(connection){
        var sql = "DELETE FROM member WHERE idteacher = ? AND idevent = ?";
        connection.query(sql,[idteacher,idevent],function(err, result){
            if(err){
                callback(err,[]);
            } else {
                callback(null, result);
            }
        });
    } else callback(true,"Not Connected");
};
module.exports = evento;