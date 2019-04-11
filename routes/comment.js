var express = require('express');
var router = express.Router();

// Models
var comment_model = require('../models/comment_model');
var teacher_model = require("../models/teacher_model");
var resource_model = require('../models/resource_model');

// Agrega un comentario
router.post('/add_comment', function (req, res) { //TODO Agregar idteacher
  var data = {
    idteacher: req.session.teacherData.idteacher,
    idresource: req.body.idresource,
    comment: req.body.comment
  };
  comment_model.add_comment(data, function(err) {
    if(err){
      console.log(err.message);
    }else{
      // Guarda la notificacion en la bd
      resource_model.get_resource(data.idresource, function(err, result) {
        if(err){
            console.log(err.message);
        }else{
          // Si mi comentario no es en un recurso mio entonces guardo y emito notif
          if(result[0].idteacher != req.session.teacherData.idteacher){
            var teacher_list = [result[0].idteacher];
            var notif = [["El profesor " + req.session.teacherData.username + " a comentado su recurso.", "show_a_resource(" + data.idresource + ")", "comment"]];
            teacher_model.add_notification(notif, function(err, result2){
              if(err){
                console.log(err.message);
              } else{
                var idnotif = result2.insertId;
                var teacher_notif = [[result[0].idteacher, idnotif, 1]];
                teacher_model.add_teacher_notification(teacher_notif, function(err, result){
                  if(err){
                    console.log(err.message);
                  } else {
                    console.log("notificacion almacenada");
                    req.app.locals.io.emit('add_notification', {teacher_list: teacher_list});
                  }
                });
              }
            });
          }
        }
      });
      res.send('Comentado!');
    }
  });
});

// Retorna la vista comentarios y el idresource
router.post('/view_comment/', function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
	res.render('comment/view_comment', {data: input});
});

// Retorna los comentarios y la informacion del profesor
router.get('/show_comments/:idresource', function (req, res) {
  var data = [req.session.teacherData.idteacher ,req.params.idresource];
  comment_model.show_comments(data, function(err, data) {
    if(err){
      console.log(err.message);
    }else{
      res.render('comment/show_comments', {data: data, teacher: req.session.teacherData});
    }
  });
});

// Controlador que inserta un punto en el comentario votado
router.post('/comment_point', function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  var data = {
    idteacher: req.session.teacherData.idteacher,
    idcomment: input.idcomment,
    point: input.point
  };
  comment_model.comment_point(data, function(err) {
    if(err){
      console.log(err.message);
    }else{
      res.send('ok');
    }
  });
});

// Controlador que actualiza un punto en el comentario votado
router.post('/update_comment_point', function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body));
  console.log(input);
  var data = {
    idteacher: req.session.teacherData.idteacher,
    idcomment: input.idcomment,
    point: input.point
  };
  comment_model.update_comment_point(data, function(err) {
    if(err){
      console.log(err.message);
    }else{
      res.send('ok');
    }
  });
});

// Controlador que elimina un comentario. Deberia borrar en cascada en la tabla resource_comment
router.post('/remove', function (req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
  comment_model.remove(input.idcomment, function(err) {
    if(err){
      console.log(err.message);
    }else{
      res.send('ok');
    }
  });
});

module.exports = router;