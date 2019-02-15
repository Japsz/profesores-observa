var express = require('express');
var router = express.Router();
var teacherModel = require("../models/teacher_model");

/* Inicializa variables session y renderiza mainframe */
router.get('/', function(req, res, next) {
    // req.session.isteacherLogged = false;
    if(req.session.isteacherLogged == null){
        req.session.isteacherLogged = false;
        req.session.teacherData = {};
    }
    res.render('mainframe', {});
});

/* Verifica si esta logeado para mostrar info de teacher en nav */
router.post('/is_login', function(req, res, next) {
    console.log(req.session.teacherData.idteacher);
    if(req.session.isteacherLogged == true){
        teacherModel.show_teacher(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

/* Renderiza la vista login */
router.get('/login_teacher', function(req, res, next) {
    if(req.session.isteacherLogged == false){
        res.render('teacher/login_teacher', {});
    } else{
        res.redirect('teacher');
    }
});

/* Verifica el usuario y redirecciona a mainframe si logra iniciar sesion */
router.post('/login_teacher_confirm', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = [input.username, input.password];
    teacheModel.show_teacher_by_name(data, function(err, data) {
        if(err){
            console.log(err.message);
        }else{
            if(data.length > 0){
                req.session.isteacherLogged = true;
                req.session.teacherData = data[0];
                console.log(req.session.teacherData);
                res.send("ok");
            } else {
                res.send("false");
            }
        }
    });
});
router.post('/checkEmail', function(req, res, next) {
    var input = req.body;
    teacherModel.check_email(input.email, function (err, iduser) {
        if (err) {
            res.send({err: true, errMsg: iduser});
        } else {
            res.send({err: false, value: iduser});
        }
    });
});
/* Renderiza la vista mainframe y cierra sesion */
router.get('/logout', function(req, res, next) {
    if(req.session.isteacherLogged == true){
        req.session.isteacherLogged = false;
        req.session.teacherData = {};
    }
    res.redirect('/');
});

/* Renderiza la vista informacion con los datos del usuario */
router.get('/info_teacher', function(req, res, next) {
    res.render('teacher/info_teacher', {data: req.session.teacherData});
});

/* Actualiza la información del usuario */
router.post('/update_teacher', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = [input.username, input.password];
    // HACER UPDATE
});

module.exports = router;
