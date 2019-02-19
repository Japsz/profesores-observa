var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'prof',
        password : 'belita123',
        port : 3306,
        database:'profesapp'
    },'pool')
);

var adminRoutes = require('../models/admin_model');
var teacherRoutes = require('../models/teacher_model');

/* GET users listing. */
router.get('/', function(req, res) {
    // console.log(req.session.teacherData);
    //Si esta logueado ir al index del administrador
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        res.redirect('/administrador/index');
    } else {
        //sino, no
        res.redirect('/administrador/login');
    }
});

/* Entrega los usuarios a validar y sus respuestas */
router.get('/valid_inscription', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        // Obtiene las solicitudes de inscripcion
        adminRoutes.valid_inscription(0, function(err,data){
            if(err){
                console.log(err.message);
                res.send("error");
            } else {
                console.log(data);
                res.render("admin/valid_inscription", {data: data});
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});

// Inserta los datos de un nuevo profesor
router.post('/newTeacher', function(req, res, next) {
    // Si está logueado
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        req.getConnection(function(err,connection){
            if(err){
                console.log("ERROR al crear la conexión MYSQL: %s",err);
                res.send({err:true,errMsg: "Error al conectarse a los servicios"});
            } else {
                //Consigue las estadisticas generales
                teacherRoutes.create(req.body,function(err,data){
                    if(err){
                        res.send({err:true,errMsg: "Error al crear el profesor"});
                    } else {
                        res.send({err:false,data:data});
                    }
                });
            }
        });
    } else {
        res.send({err:true,errMsg: "No tiene acceso al sistema."});
    }
});
//Renderizar login
router.get('/login', function(req, res, next) {
    // console.log(req.session.teacherData);
    res.render('admin/login', { title: 'Express' });
});
//Borrar la session
router.post('/logout', function(req, res, next) {
    // console.log(req.session.teacherData);
    req.session.isAdminLogged = false;
    req.session.userData = {};
    res.send({err:false});
});
//Handler que carga header y footers
router.get('/index', function(req, res, next) {
    // Si está logueado
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        req.getConnection(function(err,connection){
           if(err){
               console.log("ERROR al crear la conexión MYSQL: %s",err);
               res.render('/404');
           } else {
               //Consigue las estadisticas generales
               adminRoutes.stats(connection,function(err,data){
                  if(err){
                      console.log(data.errMsg);
                      res.render("/404");
                  } else {
                      res.render('admin/index',data);
                  }
               });
           }
        });
    } else {
        res.send("No tiene acceso al sistema, inicie sesión.");
    }
});

//Handler para loguearse como administrador
router.post('/handler', function(req, res, next) {
    var input = req.body;
    req.getConnection(function(err, connection){
        if(err){
            console.log("ERROR MYSQL: %s",err);
            res.send({err:true,errMsg:"Error al conseguir los datos de la Base de Datos"});
        }
        //Buscamos en la tabla admin
        connection.query("SELECT * FROM admin WHERE username = ?", [input.username], function(err, user){
            if(err){
                console.log("ERROR SELECT MYSQL: %s",err);
                res.send({err:true,errMsg:"Error al conseguir los datos de la Base de Datos"});
            } else {
                //Si existe y además calza la contraseña
                if(user.length && user[0].password == input.password){
                    req.session.isAdminLogged = true;
                    req.session.userData = user[0];
                    res.send({err:false,errMsg:"Exito"});
                } else {
                    //sino, no
                    res.send({err:true,errMsg:"El username y/o la contraseña son incorrectos, inténtelo nuevamente"});
                }
            }
        });
    });
});



module.exports = router;
