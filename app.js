var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Include configuration module - to read configuration file
var config = require('config');

// Include Google api module - to access youtube search api
var google = require('googleapis');

// Include Multer api module - for saving uploaded video
var multer  = require('multer');



// Get Google api key from config file
var API_KEY = config.get('YouTube.api_key');

// Get upload directory from config file
var UPLOAD_DIR = config.get('Files.upload_dir')

// Google youtube client
var youtube = google.youtube('v3');

// Upload api
var upload = multer({ dest: UPLOAD_DIR });



// Configure routes
var routes = require('./routes/index');
var searchYouTube = require('./routes/searchYouTube');



var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Make API_KEY accessable to our router
// Make youtube client accessable to our router
app.use(function(req, res, next) {
    req.API_KEY = API_KEY;
    req.youtube = youtube;
    next();
});



app.use('/', routes);
app.use('/search', searchYouTube);
app.post('/upload', upload.single('video.webm'), function (req, res, next) {
    console.log(req.body);

    console.log(req.file.originalname);
    console.log(req.file.filename);

    res.send({ msg:'Received ' + 1 + ' files' });
});



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
