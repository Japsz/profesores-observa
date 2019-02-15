var teacher = {};

teacher.create = function(data,connection,callback){
  if(connection){
      connection.query("INSERT INTO teacher SET ?",data,function(err,rows){
         if(err){
             console.log("Error al insertar MYSQL",err);
             callback(true,err);
         }
          callback(null,rows);
      });
  } else {
      callback(true,"");
  }
};
teacher.check_email = function(email,connection,callback){
    if(connection){
        connection.query("SELECT idteacher FROM teacher WHERE mail = ?",[email],function(err,rows){
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
module.exports = teacher;