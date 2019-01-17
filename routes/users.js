var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'root',
        password : '1234',
        port : 3306,
        database:'profesapp'
    },'pool')
);
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/handler', function(req, res, next) {
    var input = req.body;
    req.getConnection(function(err, connection){
        if(err) throw err;
        connection.query("SELECT * FROM user WHERE username = ?", [input.username], function(err, user){
            if(err) throw err;
            if(user[0].password == input.password){
                res.redirect('/main_page');
            }
            else{
                res.redirect('/');
            }
        });
    });
});



module.exports = router;
