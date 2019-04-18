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
            console.log(rows);
            res.send({success:"0",result:err});
        } else {
            res.send({success:"1",result:rows});
        }
    });
});
// Controlador para acutalizar la vista del calendario
router.post('/getQuery', function(req, res, next) {
    // console.log(req.session.teacherData);
    req.body.calendarId = 'primary';
    req.body.singleEvents = true;
    req.body.orderBy = 'startTime';
    req.body.maxResults = 5;
    gmodel.listEvents(req.body,function(err,rows){
        if(err) {
            res.send({success:"0",result:err});
        } else {
            var ideventList = [];
            for(var i = 0;i<rows.length;i++){
                if(typeof rows[i].idevent != 'undefined' && rows[i].idevent != 'undefined'){
                    ideventList.push(rows[i].idevent);
                }
            }
            evntModel.getMemberInfo(ideventList,rows,function(err,rows){
                if(err){
                    console.log(err);
                    console.log(rows);
                    res.send({success:"0",result:err});
                } else {
                    res.render('event/eventList',{evnts: rows,callerIdteacher:req.session.teacherData.idteacher},function(err,html){
                        if(err){
                            console.log(err);
                            res.send({err:true,errMsg:"Error al cargar la vista"});
                        } else {
                            res.send({err:false,html:html});
                        }
                    });
                }
            });
        }
    });
});
router.get('/getOwned',function(req,res){
   evntModel.getByProposed(1,function(err,rows){
      if(err) {
          console.log(err);
          res.send({err:true,errMsg:err,data:rows});
      } else {
          console.log(rows);
          res.send({err:null,data:rows});
      }
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
               var mine = false;
               gEvnt.title = gEvnt.summary;
               gEvnt.idevent = gEvnt.extendedProperties.private.idevent;
               gEvnt.idteacher = gEvnt.extendedProperties.private.idteacher;
               if(req.session.isteacherLogged || req.session.isAdminLogged){
                   if((gEvnt.idteacher == req.session.teacherData.idteacher) || req.session.isAdminLogged){
                       mine = true;
                   }
                   evntModel.getMemberInfo([gEvnt.idevent],[gEvnt],function(err,rows){
                       if(err) {
                           res.render('jumbotronError',{errMsg:err});
                       } else {
                           var selfResponse = "noResponse";
                           rows[0].attendees.confirmed.map(function(idx){
                              if(parseInt(idx.idteacher) == req.session.teacherData.idteacher){
                                  selfResponse = 'yes';
                                  console.log(selfResponse);
                              }
                              return idx;
                           });
                           rows[0].attendees.maybe.map(function(idx){
                               if(parseInt(idx.idteacher) == req.session.teacherData.idteacher){
                                   selfResponse = 'maybe';
                                   console.log(selfResponse);
                               }
                               return idx;
                           });
                           res.render("calendar/getEvnt",{data:rows[0],self:selfResponse,owner:mine,logged:true});
                       }
                   });
               } else {
                   res.render("calendar/getEvnt",{data:rows[0],self:"noResponse",owner:false,logged:false});
               }
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
                break;
        }
    } else res.send({err:true,errMsg:"No estás logueado, maldito jaker"});
});
// Modal para modificar un evento (si es mío)
router.post("/updEvntModal",function(req,res){
    if(req.session.isteacherLogged){
        gmodel.getEvnt('primary',req.body.idgoogle,function(err,gEvnt){
           if(err){
               console.log(req.body);
               console.log(gEvnt);
               console.log(err);
               res.render('jumbotronError',{errMsg:err});
           } else {
               if(gEvnt){
                   evntModel.getByIdgoogle(req.body.idgoogle,function (err,resEvnt){
                       if(err){
                           console.log(req.body);
                           console.log(resEvnt);
                           res.render('jumbotronError',{errMsg:err});
                       } else {
                           if(resEvnt.length){
                               if(req.session.teacherData.idteacher == resEvnt[0].idteacher){
                                   console.log(gEvnt);
                                   res.render("calendar/updEvntModalBody",{data:gEvnt,bdEvnt:resEvnt[0]},function(err,html){
                                       if(err) console.log(err);
                                       res.send({err:false,html:html});
                                   });
                               } else {
                                   res.render('jumbotronError',{errMsg:"MALDITO JAKER BASTA"});
                               }
                           } else {
                               res.render('jumbotronError',{errMsg:"Fue imposible verificar al dueño"});
                           }
                       };
                   });
               } else {
                   res.render('jumbotronError',{errMsg:"No existe lo que estabas buscando"});
               }
           }
        });
    } else res.send({err:true,errMsg:"No estás logueado, maldito jaker"});
});
//Modificar evento
router.post('/updEvnt', function(req, res, next) {
    // console.log(req.session.teacherData);
    if(req.session.isteacherLogged){
        var data = req.body;
        console.log(data);
        data.end = {dateTime:data.end,timeZone:'America/Santiago'};
        data.start = {dateTime:data.start,timeZone:'America/Santiago'};
        var idgoogle = data.idgoogle;
        var idevent = data.idevent;
        delete data.idgoogle;
        delete data.idevent;
        console.log(data);
        gmodel.updEvnt('primary',idgoogle,data,function(err,rows){
            if(err){
                console.log(err);
                console.log(rows);
                res.send({err:true,data:err});
            } else {
                res.send({err:false,data:rows});
            }

        });
    } else {
        res.send({err:true,errMsg:"no estás logueado"});
    }
});

module.exports = router;