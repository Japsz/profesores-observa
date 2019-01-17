var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});


router.get('/main_page', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
