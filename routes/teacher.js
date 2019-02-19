var express = require('express');
var router = express.Router();
var teacherModel = require("../models/teacher_model");
var send = require('../public/js/sendmail'); //Importar la funcion para enviar mail

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
    var data = [input.username, input.username, input.password];
    teacherModel.show_teacher_by_name(data, function(err, data) {
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
    var data = {
        idteacher: req.session.teacherData.idteacher,
        name: input.name, 
        username: input.username, 
        mail: input.mail,
        password: input.password,
        address: input.address
    };
    req.session.teacherData = data;
    teacherModel.update_teacher(data, function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(result);
            res.send("ok");
        }
    });
});

/* Envia mail a usuario con los datos de su cuenta */
router.post('/recover_password', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    teacherModel.show_teacher_by_mail(input.mail, function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            if(result.length > 0){
                //Variables para envio de correo, data_mail debe tener las mismas variables
                var data = new Array(result[0].username, result[0].password );
                console.log(data);
                var mails = new Array(result[0].mail); //Debe ser array!
                var subj = "Estimado usuario de Observa Ciudadanía";
                var data_mail = {
                    view: "views\\teacher\\mail_recover_password.ejs", //Path
                    subject: subj, //Asunto del mensaje
                    data: data, //Array con informacion necesaria
                    mails: result[0].mail}; //Array de los correos
                send.send_mail(data_mail,function(err) {
                    if(err){
                        console.log(err.message);
                    }
                });
                res.send("ok");
            } else {
                res.send("error");
            }
        }
    });
});

/* Inscripcion de usuario, admin debe validar */
router.post('/inscription', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        mail: input.mail,
        rut: input.rut,
        valid: 0 
        //Valid: 
        // 0 En proceso de inscripcion
        // 1 Usuario válido(con acceso a sesion)
        // 2 Usuario deshabilitado(sin acceso a sesion)
    };
    teacherModel.show_teacher_by_mail(input.mail, function(err, result){
        if (err) {
            console.log(err.message);
        } else {
            if(result.length == 0){
                teacherModel.create(data, function(err, result) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        var data = [];
                        data.push([result.insertId, "¿Cuales son sus objetivos personales?", input.q1]);
                        data.push([result.insertId, "¿A qué se dedica?", input.q2]);
                        data.push([result.insertId, "¿Porqué desea utilizar esta plataforma?", input.q3]);
                        teacherModel.add_questionary(data, function(err, result) {
                            if (err) {
                                console.log(err.message);
                                res.send("error");
                            } else {
                                res.send("ok");
                            }
                        });
                    }
                });
            } else {
                res.send("error");
            }
        }
    });
});

module.exports = router;
