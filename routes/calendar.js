var express = require('express');
var router = express.Router();
//Importar la funcion para enviar mail
var mail = require('../public/js/sendmail');
// Models
var gmodel = require('../Gmodel/event_model');
var tmodel = require('../models/teacher_model');
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
   gmodel.getEvnt('primary',req.params.idgEvnt,function(err,rows){
       if(err){
           res.send({err:true,errMsg:rows})
       } else {
           if(rows.attendees){
               var si = [];
               var talvez = [];
               var no = [];
               var pendiente = [];
               // Considerar que el user logueado aún no ha respondido
               var selfResponse = "noResponse";
               //Agruparlos segun respuesta
               rows.attendees.map(function(att,i){
                   //Si el user logueado ha respondido alguna vez, cambiar el estado de "respuesta"
                   if(att.email == req.session.teacherData.mail){
                       self = att.responseStatus;
                   }
                   switch(att.responseStatus){
                       case "accepted":
                           si.push(att.email);
                           break;
                       case "tentative":
                           talvez.push(att.email);
                           break;
                       case "needsAction":
                           pendiente.push(att.email);
                           break;
                       case "declined":
                           no.push(att.email);
                           break;
                       default:
                           break
                   };
               });
               //Buscar usuarios registrados segun email
               tmodel.getByMail(si,function(err,siList){
                   if(err){ res.send({err:true,errMsg:"BD error"});
                   } else {
                       tmodel.getByMail(no,function(err,noList){
                           if(err){ res.send({err:true,errMsg:"BD error"});
                           } else {
                               tmodel.getByMail(talvez,function(err,talvezList){
                                   if(err){ res.send({err:true,errMsg:"BD error"});
                                   } else {
                                       tmodel.getByMail(pendiente,function(err,pendienteList){
                                           if(err){ res.send({err:true,errMsg:"BD error"});
                                           } else {
                                               res.render("calendar/getEvnt",{data:rows,self:selfResponse,attendees:{no:noList,pendiente:pendienteList,si:siList,talvez:talvezList}});
                                           }
                                       });
                                   }
                               });
                           }
                       });
                   }
               });
           } else {
               rows.attendees = [];
               res.render("calendar/getEvnt",{data:rows,self:"noResponse",attendees:{no:[],pendiente:[],si:[],talvez:[]}});
           }
       };
   })
});
router.post("/updAttendee",function(req,res){
    gmodel.getEvnt('primary',req.body.idgEvnt,function (err,resEvnt){
        if(err){
            console.log(req.body);
            console.log(resEvnt);
            res.send({err:true,errMsg:"BD error"})
        } else {
            if(resEvnt.attendees){
                var hasResponse = false;
                resEvnt.attendees.map(function(evnt,i){
                   if(att.email == req.session.teacherData.mail){
                       var aux = evnt;
                       hasResponse = true;
                       aux.responseStatus = req.body.newStatus;
                       return aux;
                   } else {return evnt;}
                });
                if(!hasResponse){
                    resEvnt.attendees.push({email:req.session.teacherData.mail,responseStatus:req.body.newStatus});
                }
                gmodel.updEvnt('primary',req.body.idgEvnt,{end:resEvnt.end,start:resEvnt.start,attendees:resEvnt.attendees},function(err,data){
                    if(err){res.send({err:true,data:data});
                    } else {
                        res.redirect("/calendar/getEvnt/" + req.body.idgEvnt);
                    };
                });
            }
        };
    });
});
module.exports = router;