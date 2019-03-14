var express = require('express');
var router = express.Router();
//Importar la funcion para enviar mail
var mail = require('../public/js/sendmail');

// Models
var teacher_model = require("../models/teacher_model");

/* Inicializa variables session y renderiza mainframe */
router.get('/', function(req, res, next) {
    // req.session.isteacherLogged = false;
    if(req.session.isteacherLogged == null){
        req.session.isteacherLogged = false;
        req.session.show_image = true;
        req.session.teacherData = {};
    }
    if(req.session.isteacherLogged == true){
        // Si esta logeado va al mainframe con todas las funcionalidades
        res.render('teacher/mainframe_teacher', {data: req.session.teacherData, show_image: req.session.show_image});
    } else {
        // Si no, lo redirige a una vista donde solo puede ver el recurso sin detalles
        res.render('mainframe', {});
    }
});

/* Verifica si esta logeado para mostrar info de teacher en nav */
router.post('/is_login', function(req, res, next) {
    if(req.session.isteacherLogged == true){
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: req.session.teacherData});
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

/* Renderiza la vista login */
router.get('/login_teacher', function(req, res, next) {
    if(req.session.isteacherLogged == false){
        res.render('teacher/login_teacher', {});
    } else{
        res.redirect('teacher/');
    }
});

/* Verifica el usuario y redirecciona a mainframe si logra iniciar sesion */
router.post('/login_teacher_confirm', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = [input.username, input.username, input.password];
    teacher_model.show_teacher_by_name(data, function(err, data) {
        if(err){
            console.log(err.message);
        }else{
            if(data.length > 0){
                if(data[0].valid == 1){
                    if(data[0].perfil_image == null){
                        data[0].perfil_image = "/icons/avatar.png";
                    }
                    req.session.isteacherLogged = true;
                    req.session.teacherData = data[0];
                    console.log(req.session.teacherData);
                    res.send("ok");
                } else {
                    res.send("disable");
                }
            } else {
                res.send("false");
            }
        }
    });
});

// Chequea si existe el mail
router.post('/checkEmail', function(req, res, next) {
    var input = req.body;
    teacher_model.check_email(input.email, function (err, iduser) {
        if (err) {
            res.send({err: true, errMsg: iduser});
        } else {
            res.send({err: false, value: iduser});
        }
    });
});
/* Renderiza la vista mainframe y cierra sesion */
router.get('/logout', function(req, res, next) {
    if(typeof req.session.isteacherLogged != 'undefined' && req.session.isteacherLogged){
        req.session.isteacherLogged = false;
        req.session.teacherData = {};
        res.redirect('/');
    }
});

/* Renderiza la vista informacion con los datos del usuario */
router.get('/info_teacher', function(req, res, next) {
    if(typeof req.session.isteacherLogged != 'undefined' && req.session.isteacherLogged){
        res.render('teacher/info_teacher', {data: req.session.teacherData});
    }
});

/* Actualiza la información del usuario */
router.post('/update_teacher', function(req, res) {
    if(typeof req.session.isteacherLogged != 'undefined' && req.session.isteacherLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var idteacher = req.session.teacherData.idteacher;
        // Almacenar imagen como foto de perfil, se almacena en la carpeta del teacher
        var url_image = req.session.teacherData.perfil_image;
        console.log(req.files);
        if(req.files){
            let perfil_image = req.files.perfil_image;
            url_image = "public/uploaded-files/" + idteacher + "/" + perfil_image.name;
            perfil_image.mv(url_image);
            url_image = url_image.split("public")[1];
        }
        // Actualiza el campo public
        var public = input.name_r + "," + input.mail_r + "," + input.rut_r + "," + input.address_r + "," + input.b_date_r;
        console.log(public);
        // Fecha de nacimiento
        var birth_date = null;
        if(req.session.teacherData.birth_date != null){
            birth_date = req.session.teacherData.birth_date.slice(0, 19).replace('T', ' ');
        }
        if(input.b_date != ""){
           birth_date: input.b_date;
        }
        var data = {
            idteacher: idteacher,
            name: input.name,
            username: input.username,
            rut: input.rut,
            mail: input.mail,
            password: input.password,
            address: input.address,
            birth_date: birth_date,
            perfil_image: url_image,
            public: public
        };
        console.log(data);
        req.session.teacherData = data;
        teacher_model.update_teacher(data, function(err, result) {
            if (err) {
                console.log(err.message);
                res.send("false");
            } else {
                console.log(result);
                res.send("ok");
            }
        });
    }
});

/* Redirije a completar la información del usuario cuando la inscripcion es validada */
router.get('/complete_teacher_data/:idteacher', function(req, res, next) {
    teacher_model.show_teacher(req.params.idteacher, function (err, data) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(data);
            if(data[0].valid == 3 && data[0].password == null && data[0].username == null){
                req.session.teacherData = data[0];
                req.session.isteacherLogged = true;
                data[0].valid = 1;
                console.log(data[0]);
                // Cambia valid a 1
                teacher_model.update_valid(data[0], function(err,data){
                    if(err){
                        console.log(err.message);
                        res.send("error");
                    } else {
                        //Redirecciona a la vista de actualizar info de usuario
                        res.redirect("/teacher/info_teacher");
                    }
                });
            } else {
                res.redirect("/");
            }
        }
    });
});

/* Envia mail a usuario con los datos de su cuenta */
router.post('/recover_password', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    teacher_model.show_teacher_by_mail(input.mail, function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            if(result.length > 0){
                //Variables para envio de correo, data_mail debe tener las mismas variables
                var data = new Array(result[0].username, result[0].password );
                console.log(data);
                var mails = new Array(result[0].mail); //Debe ser array!
                var subj = "Estimado usuario de Observa Profesores";
                var data_mail = {
                    view: "views\\teacher\\mail_recover_password.ejs", //Path
                    subject: subj, //Asunto del mensaje
                    data: data, //Array con informacion necesaria
                    mails: result[0].mail}; //Array de los correos
                mail.send_mail(data_mail, function(err) {
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
        // 3 Usuario validado pero que aun no completa su info
    };
    teacher_model.show_teacher_by_mail(input.mail, function(err, result){
        if (err) {
            console.log(err.message);
        } else {
            if(result.length == 0){
                teacher_model.create(data, function(err, result) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        var data = [];
                        data.push([result.insertId, "¿Cuales son sus objetivos personales?", input.q1]);
                        data.push([result.insertId, "¿A qué se dedica?", input.q2]);
                        data.push([result.insertId, "¿Porqué desea utilizar esta plataforma?", input.q3]);
                        teacher_model.add_questionary(data, function(err, result) {
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
