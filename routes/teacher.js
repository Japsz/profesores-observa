var express = require('express');
var router = express.Router();
var connection  = require('express-myconnection');
var mysql = require('mysql');

router.use(
    connection(mysql,{
        host: '127.0.0.1',
        user: 'prof',
        password : 'belita123',
        port : 3306,
        database:'profesapp'
    },'pool')
);
/* GET users listing. */
router.get('/', function(req, res, next) {
    req.session.isteacherLogged = true;
    req.session.teacherData = {
        idteacher: 1,
        name: "alf",
        password: 123
    };
    // console.log(req.session.teacherData);
    res.render('mainframe', { title: 'Express' });
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
