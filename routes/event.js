var express = require('express');
var router = express.Router();

var gModel = require('../Gmodel/event_model');
var evntModel = require('../models/evento_model');
const ejsLint = require('ejs-lint');

// Conseguir todos Evento ligados a un idteacher
router.post('/getMine', function(req, res, next) {
    // console.log(req.session.teacherData);
    if(req.session.isteacherLogged){
        gModel.listEvents({
            calendarId: 'primary',
            privateExtendedProperty: ['idteacher=' + req.session.teacherData.idteacher],
            showDeleted: false,
            orderBy: 'startTime',
            singleEvents:true
        },function(err,rows){
            if(err){
                console.log(rows);
                res.send({err:true,errMsg:"Error al conseguir datos de BD",data:err});
            } else {
                if(rows.length){
                    var ideventList = [];
                    for(var i = 0;i<rows.length;i++){
                        console.log(rows[i].idevent);
                        if(rows[i].idevent != 'undefined'){
                            //rows[i].members = members;
                            //console.log(rows[i].members);
                            ideventList.push(rows[i].idevent);
                        }
                    };
                    evntModel.getMemberInfo(ideventList,rows,function(err,rows){
                        if(err){
                            console.log(err);
                            console.log(rows);
                            res.send({err:true,errMsg:"Error al conseguir datos de BD",data:err});
                        } else {
                            console.log(rows);
                            res.render('event/eventList',{evnts:rows,callerIdteacher:req.session.teacherData.idteacher},function(err,html){
                                if(err){
                                    console.log("Error al renderizar la vista: %s",err);
                                    res.send({err:true,errMsg:"Error al renderizar la vista: " + err,data:err});
                                } else {
                                    res.send({err:null,html:html});
                                }
                            });
                        }
                    });
                } else {
                    res.render('event/eventList',{evnts:[],callerIdteacher:req.session.teacherData.idteacher},function(err,html){
                        if(err){
                            console.log("Error al renderizar la vista: %s",err);
                            res.send({err:true,errMsg:"Error al renderizar la vista: " + err,data:err});
                        } else {
                            res.send({err:null,html:html});
                        }
                    });
                }
            }
        });
    } else {
        res.send({err:true,errMsg:"no estás logueado"});
    }
});
//Cargar filtros y barra de busqueda
router.get('/getSearchbox',function(req,res){
    res.render("event/searchbox");
});
//Cargar filtros y barra de busqueda
router.get('/getMembers/:idevent',function(req,res){
    evntModel.getMemberInfo([req.params.idevent],[{idevent:req.params.idevent}],function(err,rows){
        if(err){
            console.log(err);
            console.log(rows);
            res.send({err:true,errMsg:"Error al conseguir datos de BD",data:err});
        } else {
            console.log(rows);
            res.render('event/evntMembers',{evnt:rows[0]},function(err,html){
                if(err){
                    console.log("Error al renderizar la vista: %s",err);
                    res.send({err:true,errMsg:"Error al renderizar la vista: " + err,data:err});
                } else {
                    res.send({err:null,html:html,count:rows[0].attendees.confirmed.length + rows[0].attendees.maybe.length});
                }
            });
        }
    });
});

module.exports = router;