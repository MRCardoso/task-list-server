var mongoose = require('mongoose'),
    User = mongoose.model('User'), 
    Task = mongoose.model('Task'),
    jwt = require('jwt-simple'), 
    moment = require('moment'),
    help = require('../helpers'),
    credentials = require('../../config/credentials');

/**
 * Middleware to load the user by token jwt
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 * @param {*} next 
 */
exports.loadUserByToken = function(req, res, next){
    User.findByToken(req.headers['x-access-token'], (err, user)=>{
        if(err)
        {
            return res.status(err.sCode || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        req.user = user;
        return next();
    });
};

/**
 * Validate if the auth user is super admin
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 * @param {*} next 
 */
exports.isSuperUser = function(req, res, next)
{
    if (!credentials.isSuperUser(req.user))
    {
        return res.status(403).send({
            message: 'Usuário não autorizado!'
        });
    }
    next();
};

/**
 * middleware to load by id in the request
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 * @param {*} next
 * @param {String} id the id of the model to be loaded
 * @param {String} pname the name of the param
 */
exports.byId = function(req,res,next,id, pname)
{
    var Model=null;
    pname = pname.replace('Id','');
    switch(pname){
        case 'user': 
            Model = User.findById(id).select('_id name username email status created image');
            break;
        case 'task': 
            Model = Task.findById(id).populate('userId', '_id name username'); break;
        default:
            return res.status(500).send({message: `Requisição não autorizada`});
        break;
    }
    
    Model.exec(function(err,model) {
        if(err)
        {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        if (!model)
        {
            return res.status(400).send({
                message: `Registro não encontrado`
            });
        }
        req[`${pname}Data`] = model;
        next();
    });
};