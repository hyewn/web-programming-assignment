require('dotenv').config();

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const pages = require('./routes/index');
const authApi = require('./routes/api/auth');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use('/', pages);
app.use('/api/auth', authApi);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).send('Not Found'));

module.exports = app;
