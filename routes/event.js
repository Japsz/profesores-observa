var express = require('express');
var router = express.Router();

var gModel = require('../Gmodel/event_model');
var evntModel = require('../models/evento_model');


// Conseguir todos Evento ligados a un idteacher
router.post('/getMine', function(req, res, next) {
    // console.log(req.session.teacherData);
    if(req.session.isteacherLogged){
        evntModel.getByOwner(req.session.teacherData.idteacher,function(err,mines){
            if(err) {
                console.log("Error al conseguir de la BD: %s",err);
                res.send({err:true,errMsg:"Error al conseguir datos de BD",data:err});
            } else {
                evntModel.getByAttendee(req.session.teacherData.idteacher,function(err,atts){
                    if(err) {
                        console.log("Error al conseguir de la BD: %s",err);
                        res.send({err:true,errMsg:"Error al conseguir datos de BD",data:err});
                    } else {
                        res.render('teacher/getMine',{atts:atts,mines:mines},function(err,html){
                            if(err){
                                console.log("Error al renderizar la vista: %s",err);
                                res.send({err:true,errMsg:"Error al renderizar la vista: " + err,data:err});
                            } else {
                                res.send({err:null,html:html});
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.send({err:true,errMsg:"no estás logueado"});
    }
});
module.exports = router;