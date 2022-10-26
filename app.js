var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const fs = require('fs');
let cfg = JSON.parse(fs.readFileSync('config/config.json'));

//Import routes
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var adminRouter = require('./routes/admin');
var forumRouter = require('./routes/forums');

const { config } = require('process');

var app = express();

// Initialize session
app.use(session({
	secret: cfg.server.salt,
	resave: true,
	saveUninitialized: true
}));

//Middleware to set session variables
function setSession (req, res, next) { 
  if (!req.session.loggedIn) {
    req.session.loggedIn = false;
  }
  next()
}
app.use(setSession);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes

app.use('/', indexRouter);

//Auth routes
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/forums', forumRouter);

//Admin routes
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err.message});
});

module.exports = app;
