const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');

const middlewares = require('./middlewares/index');

// const dbConfig = require('./db');
const mongoose = require('mongoose');
// Connect to DB
// mongoose.connect(dbConfig.url);
// mongoose.connect(dbConfig.url, {useMongoClient: true});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
const passport = require('passport');
const expressSession = require('express-session');

app.use(expressSession({
    secret: "mySecretWord",
    key: "SESSIONID",
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: "/",
        maxAge: null,
        httpOnly: true
    }
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
//////////require('./passport/login')

// const login = require('./passport/login')
// login(passport);

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Initialize Passport
// const initPassport = require('./passport/init');
// initPassport(passport);

app.use(middlewares.accessControls.access_controls);

// const routes = require('./routes/index')(passport);
const routes = require('./routes/index');
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;