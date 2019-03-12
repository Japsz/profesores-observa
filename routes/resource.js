var express = require('express');
var router = express.Router();
var resource_model = require('../models/resource_model');
var teacher_model = require('../models/teacher_model');

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

//Obtiene un diccionario con una lista de objetos [{tag,idresource}, ... ]
//Retorna un diccionario con estructura {idresource: tags}
function parse_tags(tags){
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
    return idresTags;
}

//Recibe una lista de resources, y saca sus idresource
function idresource_list(resources){
    idresources = [];
    for (let resource in resources) {
        idresources.push(resources[resource].idresource);
    }
    return idresources;
}

// Esta ruta consigue los últimos recursos subidos, con sus tags.
router.post('/', function(req, res){
    resource_model.get_resources(null, function (err, results) {
        if (err) {console.log(err);}
        results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
        idresource_list(results);
        resource_model.get_tag_idresources(idresources, function (err, tags) {
            if(tags.length){
                tags = parse_tags(tags);
            }
            //Enviamos los recursos y los tags de aquellos recursos separados.
            //Para adquirir un tag es tags[idresource]
            res.render('resource/show_resources', {results: results, tags: tags, idteacher: validate(req), show_hidden: false});
        });
    });
});

//Obtener material idresource
router.post('/get/:idresource', function(req, res){
    resource_model.get_resource(req.params.idresource, function(err, results) {
        if (err) {console.log(err);}
        results = JSON.parse(JSON.stringify(results[0])); //Para quitar el RowDataPacket
        resource_model.get_tag_idresources(results.idresource, function (err, tags) {
            tags = parse_tags(tags);
            results.tags = tags;
            resource_model.get_files(results.idresource, function (err, files) {
                results.files = JSON.parse(JSON.stringify(files));
                results.logged = validate(req);
                console.log(results);
                res.render('resource/show_a_resource', results);
            });
        });
    });
});

// Muestra los recursos del teacher
router.post('/resources_by_teacher', function(req, res){
    if(validate(req)){
        resource_model.resources_by_teacher(validate(req), function(err, results) {
            results = JSON.parse(JSON.stringify(results));
            idresources = idresource_list(results);
            resource_model.get_tag_idresources(idresources, function (err, tags) {
                tags = parse_tags(tags);
                res.render('resource/show_resources', {idteacher: validate(req), tags: tags, results: results, show_hidden: true});
            });
        });
    } else{
        res.render('teacher/is_login', { is_login: validate(req), data: false});
    }
});

// Muestra los recursos en los que ha comentado el teacher
router.post('/resources_by_comment_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_comment_teacher(req.session.teacherData.idteacher, function(err, results) {
            results = JSON.parse(JSON.stringify(results));
            idresources = idresource_list(results);
            resource_model.get_tag_idresources(idresources, function (err, tags) {
                tags = parse_tags(tags);
                res.render('resource/show_resources', {idteacher: validate(req), tags: tags, results: results, show_hidden: true});
            });
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
                res.render('resource/show_resources', { is_login: req.session.isteacherLogged, results: data, idteacher: validate(req)});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Esta ruta añade un nuevo material
router.post('/add', function(req, res) {
    if (validate(req)) {
        let data = {
            resource: [validate(req), req.body.title, req.body.description, req.body.text, null],
            files: req.files,
            tags: mysplit(req.body.tags)
        };
        console.log(data);
        if (data.files.frontimage){
            data.resource[4] = data.files.frontimage.name;
        }
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
                    console.log(file);
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

// Descargar un archivo en la ruta /idteacher/idresource/file.ext
router.get('/download/:idteacher/:idresource/:filename', function (req, res) {
    console.log('Pidiendo descarga - '+req.params);
    res.download('public/uploaded-files/'+req.params.idteacher+'/'+req.params.idresource+'/'+req.params.filename);
});

//Esta ruta consigue los materiales que estén ligado a 'idtag'
router.get('/search_tags/:idtag', function(req, res, next) {
    res.render('material/ver_todos');
});

//Esta ruta consigue los materiales que tengan una palabra/texto (query) específico en su título o descripción
router.post('/search_query', function(req, res, next) {
    res.render('material/ver_todos');
});

// Muestra los recursos buscados mediante el filtro
router.post('/filter', function(req, res){
    if(req.session.isteacherLogged == true){
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
            filter: input.filter,
            tags: input.tags, 
            suport: input.suport,
            date: input.date
        };
        resource_model.filter(data, function(err, data) {
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                res.render('resource/show_resources', {tags: {}, results: data, idteacher: validate(req)});
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

module.exports = router;
