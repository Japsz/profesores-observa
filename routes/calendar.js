var express = require('express');
var router = express.Router();
//Importar la funcion para enviar mail
var mail = require('../public/js/sendmail');
// Models
var gmodel = require('../Gmodel/event_model');
var tmodel = require('../models/teacher_model');
var evntModel = require('../models/evento_model');
// Controlador para acutalizar la vista del calendario
router.get('/calendarquery', function(req, res, next) {
    // console.log(req.session.teacherData);
    gmodel.listEvents({
        calendarId: 'primary',
        timeMin: new Date(parseInt(req.query.from)).toISOString(),
        timeMax: new Date(parseInt(req.query.to)).toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
    },function(err,rows){
        if(err) {
            res.send({success:"0",result:err});
        }
        res.send({success:"1",result:rows});
    });
});
//Vista de cargar un único evento en modal
router.get('/getEvnt/:idgEvnt',function(req,res){
    //Conseguir la info del evento
   gmodel.getEvnt('primary',req.params.idgEvnt,function(err,gEvnt){
       if(err) {
           res.render('jumbotronError',{errMsg:err})
       } else {
           if(gEvnt){
               evntModel.getByIdgoogle(gEvnt.id,function(err,evntRows){
                   if(err){
                       res.render('jumbotronError',{errMsg:err});
                   } else {
                       if(evntRows.length){
                           evntModel.getAttendees(evntRows[0].idevent,function(err,attendees){
                               if(err) {
                                   res.render('jumbotronError',{errMsg:err});
                               } else {
                                   if(attendees.length){
                                       var si = [];
                                       var talvez = [];
                                       // Considerar que el user logueado aún no ha respondido
                                       var selfResponse = "noResponse";
                                       //Agruparlos segun respuesta
                                       for(var i = 0;i<attendees.length;i++){
                                           //Si el user logueado ha respondido alguna vez, cambiar el estado de "respuesta"
                                           if(attendees[i].idteacher == req.session.teacherData.idteacher){
                                               selfResponse = attendees[i].state;
                                           };
                                           switch(attendees[i].state){
                                               case "yes":
                                                   si.push(attendees[i]);
                                                   break;
                                               case "maybe":
                                                   talvez.push(attendees[i]);
                                                   break;
                                               default:
                                                   break
                                           };
                                       }
                                       res.render("calendar/getEvnt",{data:gEvnt,bdEvnt:evntRows[0],self:selfResponse,attendees:{si:si,talvez:talvez}});
                                   } else {
                                       res.render("calendar/getEvnt",{data:gEvnt,bdEvnt:evntRows[0],self:"noResponse",attendees:{si:[],talvez:[]}});
                                   }
                               }
                           });
                       } else {
                           evntModel.create({
                               title: gEvnt.summary,
                               description: gEvnt.description,
                               start: new Date(gEvnt.start.dateTime),
                               end: new Date(gEvnt.end.dateTime),
                               idteacher: 1,
                               idgoogle:gEvnt.id,
                               type:1
                           },function(err,resEvnt){
                               if(err){
                                   res.render('jumbotronError',{errMsg:err});
                               } else {
                                   evntModel.getById(resEvnt.insertId,function(err,evnt){
                                       if(err) res.render('jumbotronError',{errMsg:err});
                                       else res.render("calendar/getEvnt",{data:gEvnt,bdEvnt:evnt[0],self:"noResponse",attendees:{no:[],pendiente:[],si:[],talvez:[]}});
                                   });
                               }
                           });
                       }
                   }
               });
           } else {
               res.render('jumbotronError',{errMsg:err});
           }
       };
   });
});
// Proponer Evento
/*
* Tipos de evento:
*
* 0 -> Pendiente de aceptar
* 1 -> Aceptado
* 2 -> Cancelado
* 3 -> Creado por el administrador
* */
router.post('/proposeEvnt', function(req, res, next) {
    // console.log(req.session.teacherData);
    if(req.session.isteacherLogged){
        var data = req.body;
        data.idteacher = req.session.teacherData.idteacher;
        data.type = 0;
        data.start = data.start.split("T")[0] + " " + data.start.split("T")[1];
        data.end= data.end.split("T")[0] + " " + data.end.split("T")[1];
        evntModel.create(data,function(err,rows){
            if(err) {
                res.send({err:true,errMsg:rows});
            } else {
                res.send({err:null,data:rows});
            }
        });
    } else {
        res.send({err:true,errMsg:"no estás logueado"});
    }
});
// Modificar mi respuesta a un evento
router.post("/updAttendee",function(req,res){
    if(req.session.isteacherLogged){
        switch(req.body.state){
            case "remove":
                evntModel.removeMember(req.session.teacherData.idteacher,req.body.idevent, function(err,resEvnt){
                    if(err) res.send({err:true,errMsg:"BD error",data:err});
                    else res.send({err:false,data:resEvnt});
                });
                break;
            case "yes":
            case "maybe":
                evntModel.checkMember(req.session.teacherData.idteacher,req.body.idevent,function (err,resEvnt){
                    if(err){
                        console.log(req.body);
                        console.log(resEvnt);
                        res.send({err:true,errMsg:"BD error"});
                    } else {
                        evntModel.setMemberState(req.body.state,req.session.teacherData.idteacher,req.body.idevent,resEvnt.length,function(err,data){
                            if(err){res.send({err:true,errMsg:err.message,data:data});
                            } else {
                                res.send({err:false,data:data});
                            };
                        });
                    };
                });
                break;
            default:
                res.send({err:true,errMsg:"Respuesta a evento inválida"});
                break
        }
    } else res.send({err:true,errMsg:"No estás logueado, maldito jaker"});
});

module.exports = router;