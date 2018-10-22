var express = require('express');
var router = express.Router();

// Esta ruta entrega las reseñas de un material
router.get('/mostrar/:idmaterial', function(req, res, next) {
  res.render('/reseña/ver_todos');
});
// Esta ruta agrega una nueva reseña
router.post('/add', function(req, res, next) {
    res.send('Añadido!');
});
module.exports = router;
