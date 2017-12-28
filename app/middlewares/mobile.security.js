var User = require('mongoose').model('User'), 
    jwt = require('jwt-simple'), 
    moment = require('moment'),
    help = require('../helpers'),
    credentials = require('../../config/credentials');

exports.hasAuthorization = function(req, res, next) {
    User.findByToken(req.headers['x-access-token'], (err, user)=>{
        if(err)
        {
            return res.status(err.status || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        var decoded = jwt.decode(token, credentials.mySecret);
        
        if ( decoded.exp == user.authTokenExpires && decoded.exp <= Date.now()) {
            return res.status(401).send({message: 'Token expired, please make the login agains'});
        }
        req.user = user;
        return next();
    });
};

exports.loadUserByToken = function(req, res, next){
    User.findByToken(req.headers['x-access-token'], (err, user)=>{
        if(err)
        {
            return res.status(err.status || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        req.user = user;
        return next();
    });
};