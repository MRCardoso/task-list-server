// load the dependencies that are used in project
var express = require('express'),
    bodyParser = require('body-parser');

// create a method to configure express
module.exports = function()
{
	var app = express();

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

    process.on('uncaughtException', function (err) {
        console.log('==========Log-Exception==========');        
        console.log(err);
        console.log('========end-Log-Exception========');
    });

    app.use(function(req, res, next) 
    {        
        // Website you wish to allow to connect
        // res.header("Access-Control-Allow-Origin", "http://gvt.mc.dev.phdesign.com.br");
        // res.header("Access-Control-Allow-Origin", "https://s3-sa-east-1.amazonaws.com");
        res.header("Access-Control-Allow-Origin", "*");
        
        // Request methods you wish to allow // default 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'x-access-token,X-Requested-With, Content-Type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        // res.setHeader('Access-Control-Allow-Credentials', true); 

        // Pass to next layer of middleware
        next();
    });

    require('../app/routes.js')(app);
	return app;
};
