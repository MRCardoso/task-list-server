var User = require('mongoose').model('User'), 
    UserApi = require('mongoose').model('UserApi'), 
    help = require('../helpers'),
    credentials = require('../../config/credentials');

/**
 * Method to list all users
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.list = function(req, res)
{
    User.find(( credentials.isSuperUser(req.user) ? {} : {_id: req.user._id} ))   
    .exec((err, users) => {
        if (err){
            return res.status(500).send({message: help.getErrorMessage(err)});
        }

        res.json(users);
    });
};

/**
 * Method to create a new user with validation of unique username
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.create = function(req, res)
{
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        status: req.body.status,
        username: req.body.username,
        password: req.body.password
    });
    user.save((err, u) => {
        if (err){
            return res.status(400).send({
                message: help.getErrorMessage(err)
            });
        }
        res.json({
            message: `Usuário ${u.username} criado com sucesso!`, 
            module: u
        });
    });
};

/**
 * Method to update a user loaded in middleware byPk
 * update a user with mongoose method save
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.update = function(req,res)
{
    
    var user = req.userData,
        s3Helper = require('uploader-go-bucket').s3Helper({ bucket: credentials.s3Bucket });

    user.setFillables(req.body);
    if( req.session.image != null )
        user.image = req.session.image;

    s3Helper
    .manageObject(`${credentials.s3ImagePath}/${user._id}`, user.image, req.body.image, req.session.image)
    .then(values => {
        if( req.body.image == null && req.session.image == null)
            user.image = null;
        
        req.session.image = null;

        user.save((err,u)=> {
            if(err){
                return res.status(400).send({
                    message: help.getErrorMessage(err)
                });
            }

            return res.json({
                output: `O Usuário ${u.username} foi atualizado com sucesso!`,
                module: u
            });
        });
    }, err => {
        var messages = err.map(e => (e.message || 'erro manage bucket'));
        return res.status(400).send({
            message: messages.join('<br>')
        });
    });
};
/**
 * Method to delete a user of model User
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.delete = function(req,res)
{
    var extra = [];
    req.userData.remove(function (err)
    {
        if(err)
        {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        else
        {
            res.json({
                output: `Usuário ${req.userData.username} removido com sucesso!`,
                module: req.userData
            });
        }
    });
};

/**
 * Method to delete a api of the user logged
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.deleteApi = function (req, res)
{
    var p = (req.params || {});
    if( !p.userId || !p.apiId){
        return res.status(400).send({
            message: "Não foi possivel encotrar o token a ser removido"
        });
    }
    UserApi.findOneAndRemove({_id: p.apiId, userId: p.userId}, function (err) {
        if (err) {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        else {
            res.json({
                output: `Token do usuário removido com sucesso!`,
                module: {}
            });
        }
    });
};
/**
 * Method to return the user loaded in middleware byId
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.read = function (req,res)
{
    UserApi.find({ userId: req.userData._id }, function (err, apiList) {
        req.userData.userApis = apiList;
        res.json(req.userData);
    })
};

/**
 * Validate of the auth user is the same of the load user
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 * @param {*} next 
 */
exports.isOwner = function(req, res, next)
{
    if (req.userData.id !== req.user.id)
    {
        return res.status(403).send({
            message: 'Usuário não autorizado!'
        });
    }
    next();
};