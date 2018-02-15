// load the dependencies that are used in project
var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    morgan = require('morgan'),
    compress = require('compression'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    passport = require('passport');

// create a method to configure express
module.exports = function()
{
	var app = express();

	if(process.env.NODE_ENV === 'development')
        app.use(morgan('dev'));
    else if(process.env.NODE_ENV == 'production')
        app.use(compress());

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    process.on('uncaughtException', function (err) {
        console.log('==========Log-Exception==========');        
        console.log(err);
        console.log('========end-Log-Exception========');
    });

    app.use(function(req, res, next) 
    {
        // Website you wish to allow to connect
        // res.header("Access-Control-Allow-Origin", "https://google.com");
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Credentials', false);
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, x-access-token, Content-Type, Accept');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        // res.header('Access-Control-Allow-Credentials', true); 

        next();
    });

    // define the directory static
    app.use(express.static('./public'));
    
    // define the directory with views
	app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes.js')(app);
	return app;
};
