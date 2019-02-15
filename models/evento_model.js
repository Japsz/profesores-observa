var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'profesapp',
    port: 3306
});
connection.connect();

var evento = {};
//Modelo para Crear un evento
evento.create = function(data,tags,callback){
    // data = { (Todo lo necesario para crear un evento) }
    // tags = [ (Lista con los idtags a ligar al evento) ]
    connection.query("INSERT INTO evento SET ?",data,function(err,data){
       if(err){
           console.log("Error en la creación de evento: %s",err);
           callback(true,{err:err})
       } else{
           callback(null,data);
       }
    });
};
//Modelo para conseguir todos los eventos ligado a un
evento.get_Id = function(idevento,callback){
    // idevento = se explica solo
  connection.query("SELECT * FROM evento WHERE idevento = ?",[idtag],function(err,data){
      if(err){
          console.log("Error en la selección por idevento: %s",err);
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