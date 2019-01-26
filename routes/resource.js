var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'root',
        password : '',
        port : 3306,
        database:'profesapp'
    },'pool')
);
/*
  Los recursos (contribuciones) tienen tipo, el cual es un INT correspondiente a:

  0 = Archivo
  1 = Imagen
  2 = Video
  3 = Link

  */
//Función Para verificar si el usuario que pide la información puede acceder a ella.
//¿¿ Esto no deberia ser de usuario ??
function validate(){
    //TODO
    return true;
}
// Esta ruta consigue los últimos materiales subidos
router.get('/', function(req, res, next) {
    res.render('resource/show_resources');
});

router.get('/:idresource', function(req, res, next){
    //Obtener material idresource
    res.render('resource/show_a_resource');
});

// Esta ruta consigue la info de UN material,
router.get('/mostrar/:idmaterial', function(req, res, next) {
    if(validate()){
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
router.post('/add', function(req, res) {
    //Formato direccion de guardado 'public/uploaded-files/<idteacher>/<filename>.<ext>'
    if(validate()){ //TODO El idteacher deberia guardarse en una variable de sesion. Para tratar todo lo del usuario.
        req.getConnection(function (err,connection) {
            let body = req.body;
            //Creamos un recurso.
            connection.query('INSERT INTO resource (idteacher, title, author, description, text) VALUES (?)',
                [[1, body.title, body.author, body.description, body.text]],    //TODO Cambiar idteacher
                function (err, result) {
                    if (err) {console.log(err);}
                    let idresource = result.insertId;   //Sacamos idresource de lo que insertamos.
                    console.log('Se ha insertado '+idresource);
                    //Si hay archivos, los guardamos en el servidor y el nombre en la BD.
                    if (req.files){
                        for (let key in req.files) {
                            let filename = req.files[key].name;
                            req.files[key].mv('public/uploaded-files/1/'+filename); //TODO Ese 1 debe ser idteacher.
                            connection.query('INSERT INTO files (idresource, filename) VALUES (?)',
                                [[idresource,filename]],
                                function (err, result) {
                                    if (err) {console.log(err);}
                                    console.log('Se ha insertado un file.');
                                });
                        }
                    }
            });
        });
    }
    res.send('Creado!');
});

module.exports = router;
