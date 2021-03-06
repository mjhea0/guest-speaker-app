// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

// *** seed the database *** //
if (process.env.NODE_ENV === 'development') {
  var seedSpeakers = require('./models/seeds/speakers.js');
  seedSpeakers();
}


// *** routes *** //
var routes = require('./routes/index.js');
var speakerRoutes = require('./routes/speaker.js');
var authRoutes = require('./routes/auth.js');


// *** express instance *** //
var app = express();


// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
// if flash message, add to response then delete it
app.use(function(req, res, next){
  res.locals.sessionFlash = req.session.flash;
  delete req.session.flash;
  next();
});
app.use(passport.initialize());
app.use(passport.session());


// *** main routes *** //
app.use('/', routes);
app.use('/api/v1/', speakerRoutes);
app.use('/auth/', authRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
