var express = require('express');
var router = express.Router();
var resource_model = require('../models/resource_model');

//Función Para verificar si el usuario que pide la información puede acceder a ella.
//¿¿ Esto no deberia ser de usuario ??
function validate(req){
    if(req.session.isteacherLogged){
        return req.session.teacherData.idteacher;
    }
    else return null;
}

function mysplit(str){
    str = str.split(', ');
    str = str.toString();
    str = str.split(',');
    console.log(str);
    return str;
}

// Esta ruta consigue los últimos recursos subidos, con sus tags.
router.post('/', function(req, res){
	resource_model.get_resources(null, function (err, results) {
		if (err) {console.log(err);}
		results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
		idresources = [];
		for (let result in results) {
			idresources.push(results[result].idresource);
		}
		resource_model.get_tag_idresources(idresources, function (err, tags) {
		    //Obtenemos los tags, y los trabajamos.
			tags = JSON.parse(JSON.stringify(tags));
			tagsLst = [];
			idresTags = {};
			idres = tags[0].idresource;
            for (let tag in tags){
                if (idres == tags[tag].idresource){
                    tagsLst.push(tags[tag].tag);
                }
                else {
                    idresTags[idres] = tagsLst;
                    idres = tags[tag].idresource;
                    tagsLst = [];
                    tagsLst.push(tags[tag].tag);
                }

            }
            idresTags[idres] = tagsLst;
            //console.log(results);
            //console.log(idresTags);
            //Enviamos los recursos y los tags de aquellos recursos separados.
            //Para adquirir un tag es tags[idresource]
		    res.render('resource/show_resources', {results: results, tags: idresTags, idteacher: validate(req)});
		});
	});
});

//Obtener material idresource
router.post('/get/:idresource', function(req, res){
    resource_model.get_resource(req.params.idresource, function(err, results) {
        if (err) {console.log(err);}
        results = JSON.parse(JSON.stringify(results[0])); //Para quitar el RowDataPacket
        resource_model.get_tag_idresources(results.idresource, function (err, tags) {
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
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                res.render('resource/show_resources', {idteacher: validate(req), tags: {}, results: data});
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
                res.render('resource/show_resources', { idteacher: validate(req), tags: {}, results: data});
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
    if (validate(req)) {
        let data = {
            resource: [validate(req), req.body.title, req.body.description, req.body.text],
            files: req.files,
            tags: mysplit(req.body.tags)
        };
        resource_model.new_resource(data.resource, function (err, results) {
            data.insertId = results.insertId;
            for (tag in data.tags) {
                resource_model.new_resource_tag([results.insertId, data.tags[tag]], function (err, result) {
                    console.log('Se ha creado un nuevo resource tag')
                });
            }
            if (data.files) {
                for (key in data.files) {
                    file = data.files[key];
                    //TODO ¿Si ya existe un archivo con ese nombre en la carpeta?
                    file.mv('public/uploaded-files/' + validate(req) + '/' + data.insertId + '/' + file.name);
                    resource_model.new_file([data.insertId, file.name], function (err, results) {
                        console.log('Se ha insertado ' + file.name);
                    });
                }
            }
        });
        res.send('Creado!');
    }
});

router.post('/edit', function(req, res) {
    if (validate(req)) {
        console.log(req.body);
        data = [
            req.body.title,
            req.body.description,
            req.body.idresource
        ];
        console.log(data);
        resource_model.edit_resource(data, function (err, results) {
            resource_model.delete_resource_tag(data[2], function (err, results) {
                tags = mysplit(req.body.tags);
                for (tag in tags) {
                    resource_model.new_resource_tag([data[2], tags[tag]], function (err, result) {
                        console.log('Se ha creado un nuevo resource tag')
                    });
                }
            });
            res.send('Actualizado!')
        });
    }

});

router.post('/change_state', function (req, res) {
    resource_model.change_state([req.body.state, req.body.idresource], function (err, results) {
        console.log('desactiv');
        res.send('Desactivado!');
    });
});

module.exports = router;
