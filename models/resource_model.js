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



module.exports = router;
