var express = require('express');
var router = express.Router();
var send = require('../public/js/sendmail'); //Importar la funcion para enviar mail

// Modelos
var admin_model = require('../models/admin_model');
var teacher_model = require('../models/teacher_model');

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

//Renderizar login
router.get('/login', function(req, res, next) {
    // console.log(req.session.teacherData);
    res.render('admin/login', { title: 'Express' });
});

//Borrar la session
router.post('/logout', function(req, res, next) {
    // console.log(req.session.teacherData);
    req.session.isAdminLogged = false;
    req.session.adminData = {};
    res.send({err:false});
});

//Handler que carga header y footers
router.get('/index', function(req, res, next) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
       res.render('admin/index');
    } else {
        res.send("No tiene acceso al sistema, inicie sesión.");
    }
});

//Handler para loguearse como administrador
router.post('/handler', function(req, res, next) {
    var input = req.body;
    var data = [input.username, input.password];
    admin_model.show_admin_by_name(data, function(err,data){
        if(err){
            console.log(err.message);
            res.send("error");
        } else {
            if(data.length > 0){
                req.session.isAdminLogged = true;
                req.session.adminData = data[0];
                res.send({err:false,errMsg:"Exito"});
            } else {
                res.send({err:true,errMsg:"El username y/o la contraseña son incorrectos, inténtelo nuevamente"});
            }
        }
    });
});

// Inserta los datos de un nuevo profesor
router.post('/newTeacher', function(req, res, next) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){ // Si está logueado
        teacher_model.create(req.body,function(err,data){
            if(err){
                res.send({err:true,errMsg: "Error al crear el profesor"});
            } else {
                res.send({err:false,data:data});
            }
        });
    } else {
        res.send({err:true,errMsg: "No tiene acceso al sistema."});
    }
});

/* Entrega los usuarios a validar y sus respuestas */
router.get('/valid_inscription', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        // Obtiene las solicitudes de inscripcion
        admin_model.valid_inscription(0, function(err,data){
            if(err){
                console.log(err.message);
                res.send("error");
            } else {
                res.render("admin/valid_inscription", {data: data});
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});

/* Valida las solicitudes de inscripcion (cambia valid a 1 y envia un mail para rellenar datos) */
router.post('/valid_teacher', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            idteacher: input.idteacher,
            valid: 1
        };
        teacher_model.update_valid(data, function(err,data){
            if(err){
                console.log(err.message);
                res.send("error");
            } else {
                // Enviar correo afirmando la solicitud !!!!!!
                res.send("ok");
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});

/* Inhabilita a un solicitante de inscripción (no le permite iniciar sesion) */
router.post('/disable_teacher', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            idteacher: input.idteacher,
            valid: 2
        };
        teacher_model.update_valid(data, function(err,data){
            if(err){
                console.log(err.message);
                res.send("error");
            } else {
                res.send("ok");
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});

module.exports = router;
