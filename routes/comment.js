var express = require('express');
var router = express.Router();
var comment_model = require('../models/comment_model');

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
      res.send('Comentado!');
    }
  });
});

// Retorna la vista comentarios y el idresource
router.get('/view_comment/:idresource', function (req, res) {
	res.render('comment/view_comment', {idresource: req.params.idresource});
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