var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var homeRouter = require('./routes/home');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set('views', path.join(__dirname, 'views'));

app.get('/', (_, res) => res.redirect('/login'));

app.use('/', loginRouter); 
app.use('/', registerRouter);
app.use('/', homeRouter); 

module.exports = app;
