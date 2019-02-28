var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');
var resource_model = require('../models/resource_model');

//Función Para verificar si el usuario que pide la información puede acceder a ella.
//¿¿ Esto no deberia ser de usuario ??
function validate(req){
    if(req.session.isteacherLogged){
        return req.session.teacherData.idteacher;
    }
    else return null;
}

// Esta ruta consigue los últimos materiales subidos
router.get('/', function(req, res){
	idteacher = validate(req);
	resource_model.get_resources(null, function (err, results) {
		if (err) {console.log(err);}
		results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
		idresources = [];
		for (let result in results) {
			idresources.push(results[result].idresource);
		}
		resource_model.get_tag_idresource(idresources, function (err, tags) {
			tags = JSON.parse(JSON.stringify(tags));
			tagsLst = [];
			idresTags = {};
            if(tags.length > 0){
                idres = tags[0].idresource;
                for (let tag in tags){
                    if (tags[tag].idresource != idres || tag == (tags.length-1)){
                       idresTags[idres] = tagsLst;
                       idres = tags[tag].idresource;
                       tagsLst = [];
                    }
                    tagsLst.push(tags[tag].tag);
                }
                //Enviamos los recursos y los tags de aquellos recursos separados.
                //Para adquirir un tag es tags[idresource]
                res.render('resource/show_resources', {results: results, tags: idresTags, idteacher: idteacher});
            } else {
                res.render('resource/show_resources', {results: results, tags: idresTags, idteacher: idteacher});
            }
		});
	});
});

//Obtener material idresource
router.get('/get/:idresource', function(req, res){
    resource_model.get_resource(req.params.idresource, function(err, results) {
        if (err) {console.log(err);}
        results = JSON.parse(JSON.stringify(results[0])); //Para quitar el RowDataPacket
        resource_model.get_tag_idresource(results.idresource, function (err, tags) {
            tags = JSON.parse(JSON.stringify(tags));
            tagsLst = [];
            for (tag in tags){
                tagsLst.push(tags[tag].tag);
            }
            results.tags = tagsLst;
            console.log(results);
            res.render('resource/show_a_resource', results);
        });

    });
});

// Muestra los recursos del teacher
router.post('/resources_by_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_teacher(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Muestra los recursos en los que ha comentado el teacher
router.post('/resources_by_comment_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_comment_teacher(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Muestra los recursos con reseña del teacher
router.post('/resources_by_review', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_review(req.session.teacherData.idteacher, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

//Esta ruta consigue los materiales que estén ligado a 'idtag'
router.get('/search_tags/:idtag', function(req, res, next) {
    res.render('material/ver_todos');
});

//Esta ruta consigue los materiales que tengan una palabra/texto (query) específico en su título o descripción
router.post('/search_query', function(req, res, next) {
    res.render('material/ver_todos');
});

// Esta ruta añade un nuevo material
router.post('/add', function(req, res) {
    if (validate()) {
        let data = {
            resource: [req.body.idteacher, req.body.title, req.body.description, req.body.text],
            files: req.files,
            tags: req.body.tags.split(',')
        };
        resource_model.new_resource(data.resource, function (err, results) {
            data.insertId = results.insertId;
            for (tag in data.tags) {
                resource_model.new_resource_tag([results.insertId, data.tags[tag]], function (err, result) {
                    console.log('Se ha creado un nuevo resource tag')
                });
            }
            if (data.files) {
                for (key in req.files) {
                    file = req.files[key];
                    filename = file.name;
                    //TODO ¿Si ya existe un archivo con ese nombre en la carpeta?
                    file.mv('public/uploaded-files/' + req.session.teacherData.idteacher + '/' + idresource + '/' + filename);
                    resource_model.new_file([results.insertId, filename], function (err, results) {
                        console.log('Se ha insertado ' + filename);
                    });
                }
            }
        });
        res.send('Creado!');
    }
});

router.get('/deactivate', function (req, res) {
    resource_model.deactivate(req.body.idresource, function (err, results) {
        console.log('desactivando?');
        res.send('Desactivado!');
    });
});


/*
// Esta ruta consigue la info de UN material,
router.get('/mostrar/:idmaterial', function(req, res, next) {
    if(validate()){
        req.getConnection(function(err,connection){
            if(err) console.log("ERROR DE CONEXIÓN A BDD: %s",err);
            connection.query("SELECT material.*,profesor.username AS usn_creador FROM material" +
                " LEFT JOIN profesor ON material.idprofesor = profesor.idprofesor WHERE idmaterial = ?",req.params.idmaterial,function(err,rows){
                if(err) console.log("ERROR AL HACER CONSULTA A BDD:\n \n %s",err);
                console.log(rows);
                if(rows.length){
                    res.render('material/ver_unico',{material: rows[0]},function(err,html){
                        if(err) console.log(err);
                        res.send(html);
                    });
                } else res.redirect("/bad_login");
            });
        });
    } else res.redirect("/bad_login");
});
*/

module.exports = router;
