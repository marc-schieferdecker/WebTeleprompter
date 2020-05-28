'use strict';

var createError = require('http-errors');
var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var i18n = require('i18n');

var app = express();

// Multi language implementation
var i18nconfig = {
  locales:['en', 'de'],
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  directory: path.join(__dirname,'resources','private','locales')
};
i18n.configure(i18nconfig);
app.set('i18nconfig', i18nconfig);

// View settings
var hbsConfig = {
  defaultLayout: "page",
  extname: ".hbs",
  helpers: require(path.join(__dirname, 'resources', 'private', 'helpers','handlebars')).helpers,
  partialsDir: path.join(__dirname, 'resources', 'private', 'partials'),
  layoutsDir: path.join(__dirname, 'resources', 'private', 'layouts'),
  templatesDir: path.join(__dirname, 'resources', 'private', 'templates')
};
app.engine("hbs", handlebars(hbsConfig));
app.set('views', hbsConfig.templatesDir);
app.set("view engine", "hbs");
app.set("hbsConfig", hbsConfig);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'resources', 'public')));
app.use(express.static(path.join(__dirname, 'resources', 'public')));

// Global language switch and language initialisation
app.use((req, res, next) => {
  if(req.query.lang) {
    res.cookie('lang', req.query.lang, { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
    return res.redirect('/settings');
  }
  else {
    if( typeof req.cookies['lang'] === 'undefined') {
      res.cookie('lang', 'en', { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/' });
    }
  }
  i18n.setLocale(typeof req.cookies['lang'] === 'undefined' ? 'en' : req.cookies['lang']);
  next();
});
app.use(i18n.init);
app.use('/i18n.json', (req, res, next) => {
  res.send(i18n.getCatalog(i18n.getLocale()));
});

// Controller config
var homeRouter = require('./routes/home');
app.use('/', homeRouter);
var documentsRouter = require('./routes/documents');
app.use('/documents', documentsRouter);
var settingsRouter = require('./routes/settings');
app.use('/settings', settingsRouter);
var donateRouter = require('./routes/donate');
app.use('/donate', donateRouter);

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
  res.render('error');
});

module.exports = app;
