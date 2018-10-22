var express = require('express');
var router = express.Router();

/*
  Los materiales (contribuciones) tienen tipo, el cual es un INT correspondiente a:

  0 = Archivo
  1 = Imagen
  2 = Video
  3 = Link

  */

// Esta ruta consigue los últimos materiales subidos
router.get('/', function(req, res, next) {
    res.render('material/ver_todos');
});
// Esta ruta consigue la info de UN material,
router.get('/mostrar/:idmaterial', function(req, res, next) {
    res.render('material/ver_unico',{material: {idmaterial: req.params.idmaterial}});
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
router.post('/add', function(req, res, next) {
    res.send('Creado!');
});
module.exports = router;
