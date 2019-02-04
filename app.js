var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressFU = require('express-fileupload'); //https://www.npmjs.com/package/express-fileupload
var http = require('http');

var index = require('./routes/index');
var users = require('./routes/users');
var resource = require('./routes/resource');
var reseña = require('./routes/reseña');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressFU({
    preserveExtension: 5,    //Se mantiene extension
    safeFileNames: true,        //Se borraran caracteres no alfanumericos
    createParentPath: true,      //Se crea el directorio si no existe
    tempFileDir: 'public/tmpfiles/'
}));

app.use('/', index);
app.use('/users', users);
app.use('/resource', resource);
app.use('/review', reseña);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var server  = http.createServer(app);

server.listen(app.get('port'), function(){
    console.log('The server starts on port ' + app.get('port'));
});


module.exports = app;
