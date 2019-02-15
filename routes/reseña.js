var express = require('express');
var router = express.Router();
var recurso = require("../models/resource_model");

// Esta ruta entrega las reseñas de un recurso
router.get('/mostrar/:idrecurso', function(req, res, next) {
    recurso.getbyidtag({idtag:[]},function(err,recursos){
        res.render('/reseña/ver_todos');
    });
});
// Esta ruta agrega una nueva reseña
router.post('/add', function(req, res, next) {
    res.send('Añadido!');
});
module.exports = router;
