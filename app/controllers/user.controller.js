var User = require('mongoose').model('User'), 
    help = require('../helpers');

exports.list = function(req, res){
    User.find({}, (err, users) => {
        if (err){
            return res.status(500).send({
                message: err
            });
        }

        res.json(users);
    });
};

exports.create = function(req, res, next)
{
    User.findUniqueUsername(req.body.username, (err, user) =>
    {
        if(err){
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        } 

        var user = new User({
            name: req.body.name,
            email: req.body.email,
            status: req.body.status,
            username: req.body.username,
            password: req.body.password
        });
        user.save(err => {
            if (err){
                return res.status(400).send({
                    message: help.getErrorMessage(err)
                });
            }
            res.json({
                message: `User ${user.name} created with successfull`, 
                data: user
            });
        });
    });
};