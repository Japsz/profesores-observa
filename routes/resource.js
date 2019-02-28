var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');
var resource_model = require('../models/resource_model');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'prof',
        password : 'belita123',
        port : 3306,
        database:'profesapp'
    },'pool')
);

//Función Para verificar si el usuario que pide la información puede acceder a ella.
//¿¿ Esto no deberia ser de usuario ??
function validate(){
    //TODO validar al usuario conectado.
    // El idteacher deberia guardarse en una variable de sesion.
    //Para tratar lo del usuario. O esta misma funcion podria retornarlo.
    return true;
}
// Esta ruta consigue los últimos recursos subidos
router.get('/', function(req, res, next){
    req.getConnection(function (err, connection) {
        if (err) {console.log(err);}
        query = 'SELECT * FROM resource ' +
                'ORDER BY date DESC';
        connection.query(query, 0, function (err, results) {
            if (err) {console.log(err);}
            results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
            res.render('resource/show_resources', {results: results});
        });
    });
});

router.get('/:idresource', function(req, res){
    //Obtener recurso idresource
    req.getConnection(function (err, connection){
        if (err) {console.log(err);}
        connection.query('SELECT * FROM resource WHERE idresource = ?',
           req.params.idresource, function (err, results) {
           if (err) {console.log(err);}
           results = JSON.parse(JSON.stringify(results[0])); //Para quitar el RowDataPacket
           res.render('resource/show_a_resource', results);
       });
    });
});

// Muestra los recursos del teacher
router.post('/resources_by_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_teacher(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Muestra los recursos en los que ha comentado el teacher
router.post('/resources_by_comment_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_comment_teacher(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Muestra los recursos con reseña del teacher
router.post('/resources_by_review', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_review(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
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
    //TODO agregar los tags.
    if(validate()){
        req.getConnection(function (err,connection) {
            let body = req.body;
            //Creamos un recurso.
            connection.query('INSERT INTO resource (idteacher, title, description, text) VALUES (?)',
                [[ req.session.teacherData.idteacher, body.title, body.description, body.text]],    //TODO Cambiar idteacher
                function (err, result) {
                    if (err) {console.log(err);}
                    let idresource = result.insertId;   //Sacamos idresource de lo que insertamos.
                    console.log('Se ha insertado '+idresource);

                    //Si hay archivos, los guardamos en el servidor y el nombre en la BD.
                    //Formato direccion de guardado 'public/uploaded-files/<idteacher>/<filename>
                    if (req.files){
                        for (let key in req.files) {
                            let filename = req.files[key].name;
                            req.files[key].mv('public/uploaded-files/1/'+idresource+'/'+filename);//TODO Ese 1 debe ser idteacher.
                            connection.query('INSERT INTO file (idresource, filename) VALUES (?)',
                                [[idresource,filename]],
                                function (err, result) {
                                    if (err) {console.log(err);}
                                    console.log('Se ha insertado un file.');
                                }
                            );
                        }
                    }
                }
            );
        });
    }
    res.send('Creado!');
});


/*
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
*/

module.exports = router;
