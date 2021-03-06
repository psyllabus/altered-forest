var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var { i18nMiddleware } = require('./services/i18nService');
var { emailMiddleware } = require('./services/emailService');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18nMiddleware(app));
app.use(emailMiddleware());
app.use(
	stylus.middleware({
		src: path.join(__dirname, "/styles/"),
		dest: path.join(__dirname, "../public/stylesheets/"),
		linenos: true
	})
);
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

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
    if (err.status === 404) {
        res.render("construction", Object.assign({}, res.locals));
    }
    else {
        res.render('error', Object.assign({}, res.locals));
    }
});

module.exports = app;
