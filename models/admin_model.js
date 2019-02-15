var admin = {};

admin.create = function(data,connection,callback){
  if(connection){
      connection.query("INSERT INTO teacher SET ?",data,function(err,rows){
         if(err) throw err;
          callback(null,{msg: "hola"});
      });
  } else {
      callback(true,{msg: "hola"});
  }
};
admin.stats = function(connection,callback){
    if(connection){
        callback(null,{msg: "hola"});
    } else {
        callback(true,{errMsg: "Wena"});
    }
};
module.exports = admin;