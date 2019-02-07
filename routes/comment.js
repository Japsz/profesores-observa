var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');
var resource_model = require('../models/resource_model');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'prof',
        password : 'belita123',
        port : 3306,
        database:'profesapp'
    },'pool')
);

// Agrega un comentario
router.post('/add_comment', function (req, res) { //TODO Agregar idteacher
    req.getConnection(function (err, connection) {
        if (err) {console.log(err);}
        connection.query('INSERT INTO resource_comment (idteacher, idresource, comment) VALUES (?)',
        	[[1, req.body.idresource, req.body.comment]], function (err, results) {
            if (err) {console.log(err);}
                res.send('Comentado!');
        });
    });
});

// Retorna la vista comentarios y el idresource
router.get('/view_comment/:idresource', function (req, res) {
	res.render('comment/view_comment', {idresource: req.params.idresource});
});

// Retorna los comentarios y la informacion del profesor
router.get('/show_comments/:idresource', function (req, res) {
   	req.getConnection(function (err, connection) {
       if (err) {console.log(err);}
       connection.query("SELECT resource_comment.*, teacher.username, "
       	+ " (SELECT COALESCE(SUM(cp.point),0) FROM comment_point as cp WHERE cp.idcomment=resource_comment.idcomment) as points,"
       	+ " (SELECT COALESCE(cp.point,0) FROM comment_point as cp WHERE cp.idteacher=? AND cp.idcomment=resource_comment.idcomment) as point_teacher FROM resource_comment"
       	+ " LEFT JOIN teacher ON resource_comment.idteacher = teacher.idteacher"
       	+ " WHERE resource_comment.idresource = ?"
       	+ " ORDER BY resource_comment.date DESC", [req.session.teacherData.idteacher ,req.params.idresource] , function (err, data) {
       		console.log(data);
           	res.render('comment/show_comments', {data: data, teacher: req.session.teacherData});
       });
   });
});

// Controlador que inserta un punto en el comentario votado
router.post('/comment_point', function (req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        if (err) {console.log(err);}
        connection.query("INSERT INTO comment_point (idcomment, idteacher, point) VALUES (?)",
        	[[input.idcomment, req.session.teacherData.idteacher, input.point]], function (err, results) {
            if (err) {console.log(err);}
                res.send('ok');
        });
    });
});

// Controlador que elimina un comentario. Deberia borrar en cascada en la tabla resource_comment
router.post('/remove', function (req, res) {
	var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        if (err) {console.log(err);}
        connection.query('DELETE FROM resource_comment WHERE idcomment=' + input.idcomment, function (err, results) {
            if (err) {console.log(err);}
                res.send('ok');
        });
    });
});

module.exports = router;