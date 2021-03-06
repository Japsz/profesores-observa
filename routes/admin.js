var express = require('express');
var router = express.Router();
//Importar la funcion para enviar mail
var mail = require('../public/js/sendmail');
// Models
var admin_model = require('../models/admin_model');
var teacher_model = require('../models/teacher_model');
var gmodel = require('../Gmodel/event_model');
var evntModel = require('../models/evento_model');

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

//Handler que carga header y footers
router.get('/index', function(req, res, next) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
       res.render('admin/index');
    } else {
        res.send("No tiene acceso al sistema, inicie sesión.");
    }
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

/* Valida las solicitudes de inscripcion (cambia valid a 3 y envia un mail para rellenar datos) */
router.post('/valid_teacher', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            idteacher: input.idteacher,
            valid: 3
        };
        teacher_model.update_valid(data, function(err,data){
            if(err){
                console.log(err.message);
                res.send("error");
            } else {
                //Variables para envio de correo, data_mail debe tener las mismas variables
                teacher_model.show_teacher(input.idteacher, function (err, result) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        // Envia correo afirmando la solicitud con link a recuperar los datos
                        console.log(result);
                        var data = new Array(input.idteacher);
                        var mails = new Array(result[0].mail); //Debe ser array!
                        var subj = "Estimad@ usuario de Observa Profesores";
                        var data_mail = {
                            view: "views\\admin\\mail_valid_teacher.ejs", //Path
                            subject: subj, //Asunto del mensaje
                            data: data, //Array con informacion necesaria
                            mails: mails }; //Array de los correos
                        mail.send_mail(data_mail, function(err) {
                            if(err){
                                console.log(err.message);
                            }
                        });
                        res.send("ok");
                    }
                });
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

// Salir de la session
router.post('/logout', function(req, res, next) {
    // console.log(req.session.teacherData);
    req.session.isAdminLogged = false;
    req.session.adminData = {};
    res.send({err:false});
});
// Vista cargar calendario
router.get('/listEvnt', function(req, res, next) {
    // console.log(req.session.teacherData);
    res.render('admin/evntList');
});
// Insertar Evento
router.post('/insertEvnt', function(req, res, next) {
    // console.log(req.session.teacherData);
    req.body.idteacher = "1";
    evntModel.create({
        idteacher: 1,
        title: req.body.title,
        description:req.body.summary,
        start:req.body.start,
        end:req.body.end,
        type:1},function(err,rows){
        if(err){
            console.log(err);
            res.send({err:true,errMsg:err});
        } else {
            req.body.idevent = rows.insertId;
            gmodel.insertEvnt('primary',req.body,function(err,grows){
                if(err) {
                    res.send({err:true,data:err});
                } else {
                    evntModel.setIdgoogle(grows.id,req.body.idevent,function(err,rows){
                        if(err){
                            console.log(err);
                            res.send({err:true,errMsg:err});
                        } else {
                            res.send({err:null,data:grows});
                        }
                    });
                }
            });
        }
    });
});
/* Entrega los eventos a aprobar */
router.get('/valid_events', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        // Obtiene las propuestas de eventos.
        admin_model.eventProposals(function(err,data){
            if(err){
                res.send("error");
            } else {
                res.render("admin/valid_event", {data: data});
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});
/* Cambia el tipo de un evento y envía un mail al respecto al creador*/
router.post('/validateProposal', function(req, res) {
    if(typeof req.session.isAdminLogged != 'undefined' && req.session.isAdminLogged){
        console.log(req.body);
        evntModel.getById(req.body.idevent,function(err,event) {
            if (err) {
                console.log(err);
            } else {
                evntModel.ModifType(req.body.newtype,req.body.idevent,function(err,data){
                    if(err){
                        console.log(err.message);
                        res.send("error");
                    } else {
                        if(parseInt(req.body.newtype) == 1){
                            gmodel.insertEvnt('primary',event[0],function(err,gData){
                                if(err){
                                    console.log(err);
                                    res.send({err:true,errMsg:"Error de Google",data:gData});
                                } else {
                                    evntModel.setIdgoogle(gData.id,req.body.idevent,function(err,rows){
                                        if(err){
                                            console.log(err);
                                            res.send({err:true,errMsg:"Error de BDD",data:rows});
                                        } else {
                                            res.send({err:false,errMsg:"Exito",data:req.body});
                                        }
                                    });
                                }
                            });
                        } else {
                            res.send({err:false,errMsg:"Exito",data:req.body});
                        }
                        var estado;
                        var subj;
                        //Hacer algo según el tipo de respuesta
                        /*
                        * Tipos de evento:
                        *
                        * 0 -> Pendiente de aceptar
                        * 1 -> Aceptado
                        * 2 -> Rechazado
                        * 3 -> Creado por el administrador
                        * */
                        switch(parseInt(req.body.newtype)){
                            //Aceptado
                            case 1:
                                estado = "Aprobada";
                                subj = "Tu propuesta de evento fue " + estado;
                                break;
                            case 2:
                                estado = "Rechazada";
                                subj = "Tu propuesta de evento fue " + estado;
                                break;
                            default:
                                estado = "Nada";
                                break;

                        }
                        var mails = new Array(event[0].mail); //Debe ser array!
                        var data_mail = {
                            view: "views\\admin\\mailTemplates\\mail_validateProposal.ejs", //Path
                            subject: subj, //Asunto del mensaje
                            data: {
                                estado: estado,
                                razon: req.body.razon,
                                event: event[0]
                            },
                            //Array con informacion necesaria
                            mails: mails }; //Array de los correos
                        mail.send_mail(data_mail, function(err) {
                            if(err){
                                console.log(err.message);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.redirect('/administrador/login');
    }
});

module.exports = router;
