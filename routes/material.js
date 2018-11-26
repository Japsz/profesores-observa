var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');

router.use(
    connection(mysql,{

        host: '127.0.0.1',
        user: 'root',
        password : '1234',
        port : 3306,
        database:'profesapp'
    },'pool')
);
/*
  Los materiales (contribuciones) tienen tipo, el cual es un INT correspondiente a:

  0 = Archivo
  1 = Imagen
  2 = Video
  3 = Link

  */
//Función Para verificar si el usuario que pide la información puede acceder a ella.
function validar(){
    //TODO
    return true;
}
// Esta ruta consigue los últimos materiales subidos
router.get('/', function(req, res, next) {
    res.render('material/ver_todos');
});
// Esta ruta consigue la info de UN material,
router.get('/mostrar/:idmaterial', function(req, res, next) {
    if(validar()){
        req.getConnection(function(err,connection){
            if(err) console.log("ERROR DE CONEXIÓN A BDD: %s",err);
            connection.query("SELECT material.*,profesor.username AS usn_creador FROM material" +
               " LEFT JOIN profesor ON material.idprofesor = profesor.idprofesor WHERE idmaterial = ?",req.params.idmaterial,function(err,rows){
               if(err) console.log("ERROR AL HACER CONSULTA A BDD:\n \n %s",err);
               console.log(rows);
               if(rows.length){
                   res.render('material/ver_unico',{material: rows[0]},function(err,html){
                       if(err) console.log(err);
                       res.send(html);
                   });
               } else res.redirect("/bad_login");
            });
        });
    } else res.redirect("/bad_login");
});
//Esta ruta consigue los materiales que estén ligado a 'idtag'
router.get('/search_tags/:idtag', function(req, res, next) {
    res.render('material/ver_todos');
});
//Esta ruta consigue los materiales que tengan una palabra/texto (query) específico en su título o descripción
router.post('/search_query', function(req, res, next) {
    res.render('material/ver_todos');
});
// Esta ruta añade un nuevo material
router.post('/add', function(req, res, next) {
    res.send('Creado!');
});
module.exports = router;
