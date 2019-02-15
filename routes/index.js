var express = require('express');
var router = express.Router();

/* GET mainframe. */
router.get('/', function(req, res, next) {
	res.redirect('teacher');
});

module.exports = router;
