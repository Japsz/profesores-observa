var express = require('express');
var router = express.Router();

/* GET mainframe. */
router.get('/', function(req, res, next) {
	res.redirect('teacher');
});

router.get('/help', function(req, res){
	console.log('solicitndo ayuda');
	res.render('help');
});

module.exports = router;
