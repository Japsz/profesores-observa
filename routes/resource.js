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
    return str;
}

function getXtension(str) {
    str = str.split('.');
    str = str[str.length-1];
    return str;
}

//Obtiene un diccionario con una lista de objetos [{idresource, tag, type}, ... ]
//Retorna un diccionario con estructura {idresource: [tags, type]}
function parse_tags(tags){
    tags = JSON.parse(JSON.stringify(tags));
    console.log(tags);
    tagsLst = [];
    idresTags = {};
    if(tags.length > 0){
        idres = tags[0].idresource;
        for (let tag in tags){
            if (idres == tags[tag].idresource){
                tagsLst.push([tags[tag].tag, tags[tag].type]);
            }
            else {
                idresTags[idres] = tagsLst;
                idres = tags[tag].idresource;
                tagsLst = [];
                tagsLst.push([tags[tag].tag, tags[tag].type]);
            }
        }
        idresTags[idres] = tagsLst;
    }
    return idresTags;
}

function parse_score(scores){
    scores = JSON.parse(JSON.stringify(scores));
    let scoreLst;
    idresScore = {};
    if(scores.length > 0){
        idres = scores[0].idresource;
        for (let score in scores){
            if (idres == scores[score].idresource){
                scoreLst = scores[score].sum/scores[score].count;
            }
            else {
                idresScore[idres] = scoreLst;
                idres = scores[score].idresource;
                scoreLst = scores[score].sum/scores[score].count;
            }
        }
        idresScore[idres] = scoreLst;
    };
    return idresScore;
}

//Recibe una lista de resources, y saca sus idresource
function idresource_list(resources){
    var idresources = [];
    // console.log(resources);
    for (let resource in resources) {
        idresources.push(resources[resource].idresource);
    }
    return idresources;
}

// Esta ruta consigue los últimos recursos subidos, con sus tags.
router.post('/', function(req, res){
    resource_model.get_resources(null, function (err, results) {
        if(err){
            console.log(err.message);
        } else {
            if(results.length > 0){
                results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
                var idresources = idresource_list(results);
                resource_model.get_tag_idresources(idresources, function (err, tags) {
                    tags = parse_tags(tags);
                    resource_model.get_scores(idresources, function (err, scores) {
                        scores = parse_score(scores);
                        console.log(scores);
                        //Enviamos los recursos y los tags de aquellos recursos separados, lo mismo para scores.
                        //Para adquirir un tag es tags[idresource]
                        res.render('resource/show_resources',
                            {results: results, tags: tags,
                                idteacher: validate(req), scores: scores,
                                show_image: req.session.show_image, show_hidden: false});
                    });
                });
            } else {
                res.render('resource/show_resources',
                    {results: results, tags: {}, idteacher: validate(req),
                        show_hidden: false, show_image: req.session.show_image});
            }
        }
    });
});

//Obtener material idresource
router.get('/get/:idresource', function(req, res){
    resource_model.get_resource(req.params.idresource, function(err, results) {
        if(err){
            console.log(err.message);
        } else {
            if(results.length > 0){
                results = JSON.parse(JSON.stringify(results[0])); //Para quitar el RowDataPacket
                resource_model.get_tag_idresources(results.idresource, function (err, tags) {
                    tags = parse_tags(tags);
                    results.tags = tags;
                    resource_model.get_files(results.idresource, function (err, files) {
                        results.files = JSON.parse(JSON.stringify(files));
                        results.logged = validate(req);
                        // console.log(results);
                        res.render('resource/show_a_resource', results);
                    });
                });
            } else {
                res.render('resource/show_a_resource', results);
            }
        }
    });
});

// Muestra los recursos del teacher
router.post('/resources_by_teacher', function(req, res){
    if(validate(req)){
        var input = JSON.parse(JSON.stringify(req.body));
        var idteacher = validate(req);
        if(!input.session_teacher){
            idteacher = input.idteacher;
        }
        resource_model.resources_by_teacher(idteacher, function(err, results) {
            if(err){
                console.log(err.message);
            } else {
                if(results.length > 0){
                    results = JSON.parse(JSON.stringify(results));
                    var idresources = idresource_list(results);
                    resource_model.get_tag_idresources(idresources, function (err, tags) {
                        tags = parse_tags(tags);
                        results.tags = tags;
                        res.render('resource/show_resources', {idteacher: validate(req), show_image: req.session.show_image, tags: tags, results: results, show_hidden: true});
                    });
                } else {
                    res.render('resource/show_resources', {idteacher: validate(req), show_image: req.session.show_image, tags: {}, results: results, show_hidden: true});
                }
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: validate(req), data: false});
    }
});

// Muestra los recursos en los que ha comentado el teacher
router.post('/resources_by_comment_teacher', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_comment_teacher(req.session.teacherData.idteacher, function(err, results) {
            if(err){
                console.log(err.message);
            } else {
                if(results.length > 0){
                    results = JSON.parse(JSON.stringify(results));
                    var idresources = idresource_list(results);
                    resource_model.get_tag_idresources(idresources, function (err, tags) {
                        tags = parse_tags(tags);
                        results.tags = tags;
                        res.render('resource/show_resources', {idteacher: validate(req), show_image: req.session.show_image, tags: tags, results: results, show_hidden: true});
                    });
                } else {
                    res.render('resource/show_resources', {idteacher: validate, show_image: req.session.show_image, tags: {}, results: results, show_hidden: true});
                }
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Muestra los recursos con reseña del teacher
router.post('/resources_by_review', function(req, res){
    if(req.session.isteacherLogged == true){
        resource_model.resources_by_review(req.session.teacherData.idteacher, function(err, results) {
            if(err){
                console.log(err.message);
            } else{
                if(results.length > 0){
                    results = JSON.parse(JSON.stringify(results));
                    var idresources = idresource_list(results);
                    resource_model.get_tag_idresources(idresources, function (err, tags) {
                        tags = parse_tags(tags);
                        results.tags = tags;
                        res.render('resource/show_resources', {idteacher: validate(req), show_image: req.session.show_image, tags: tags, results: results, show_hidden: true});
                    });
                } else {
                    res.render('resource/show_resources', {idteacher: validate(req), show_image: req.session.show_image, tags: {}, results: results, show_hidden: true});
                }
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Esta ruta añade un nuevo material
router.post('/add', function(req, res) {
    if (validate(req)) {
        console.log('Imprimiendo body');
        console.log(req.body);
        console.log(req.files);
        let data = {
            resource: [validate(req), req.body.title, req.body.description, req.body.text, null],
            files: req.files,
            tags: mysplit(req.body.tags),
            box: req.body.box
        };
        if (!('frontimage' in req.body)){
            console.log("Foto de portada");
            data.resource[4] = data.files.frontimage.name;
        }
        console.log('agregandorecurso');
        resource_model.new_resource(data.resource, function (err, results) {
            data.insertId = results.insertId;
            for (tag in data.tags) {
                resource_model.new_resource_tag([results.insertId, data.tags[tag], 'area'], function (err, result) {
                    console.log('Se ha creado un nuevo resource tag');
                });
            }
            console.log(data.box);
            if (typeof data.box == 'string'){
                resource_model.new_resource_tag([results.insertId, data.box, 'type'], function (err, result) {
                    console.log('Se ha creado un nuevo resource tag');
                });
            } else {
                for (box in data.box) {
                    console.log(data.box[box]);
                    resource_model.new_resource_tag([results.insertId, data.box[box], 'type'], function (err, result) {
                        console.log('Se ha creado un nuevo resource tag');
                    });
                }
            }
            if (req.body.idresourcedad){
                resource_model.new_review([req.body.idresourcedad, results.insertId], function (err, results) {
                    console.log('Se ha creado una review');
                });
            }

            if (data.files) {
                var extlist = [];
                console.log('agregando archivos');
                for (key in data.files) {
                    var file = data.files[key];
                    extlist.push(getXtension(file.name));
                    //TODO ¿Si ya existe un archivo con ese nombre en la carpeta?

                    file.mv('public/uploaded-files/' + validate(req) + '/' + data.insertId + '/' + file.name);
                    console.log('aqui cago?');
                    resource_model.new_file([data.insertId, file.name], function (err, results) {
                    });
                }
                extlist = new Set(extlist);
                extlist = Array.from(extlist);
                console.log(extlist);
                for (ext in extlist){
                    console.log(extlist[ext]);
                    resource_model.new_resource_tag([data.insertId, extlist[ext], 'file'], function (err, results) {
                        console.log('Se han insertado tags file ' + extlist[ext]);
                    });
                };
            }
            res.send('Creado!');
        });
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

router.post('/score', function (req, res) {
    let body = req.body;
    resource_model.score([body.idteacher, body.idresource, body.score],function (err,results) {
        console.log('Has insertado un puntaje');
        res.send('Scored!');
    });
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
        resource_model.filter(data, function(err, results) {
            if(err){
                console.log(err.message);
            }else{
                if(results.length > 0){
                    console.log(results);
                    results = JSON.parse(JSON.stringify(results)); //Para quitar el RowDataPacket
                    var idresources = idresource_list(results);
                    // console.log(idresources);
                    resource_model.get_tag_idresources(idresources, function (err, tags) {
                        tags = parse_tags(tags);
                        console.log(tags);
                        //Enviamos los recursos y los tags de aquellos recursos separados.
                        //Para adquirir un tag es tags[idresource]
                        res.render('resource/show_resources', {results: results, show_image: req.session.show_image, tags: tags, idteacher: validate(req), show_hidden: false});
                    });
                } else {
                    res.render('resource/show_resources', {results: results, show_image: req.session.show_image, tags: {}, idteacher: validate(req), show_hidden: false});                    
                }
            }
        });
    } else{
        res.render('teacher/is_login', { is_login: req.session.isteacherLogged, data: false });
    }
});

// Esta ruta cambia la cookie show_image
router.post('/show_image', function(req, res){
    if(req.session.show_image == true){
        req.session.show_image = false;
    } else {
        req.session.show_image = true;
    }
    res.redirect('/');
});

module.exports = router;
