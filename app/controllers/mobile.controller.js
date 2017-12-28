var User = require('mongoose').model('User'), 
    Task = require('mongoose').model('Task'), 
    jwt = require('jwt-simple'), 
    moment = require('moment'),
    help = require('../helpers'),
    credentials = require('../../config/credentials');

/**
| --------------------------------------------------------------------------------
| Authenticate a user by username and password, 
| and creates a token to use in api secrety requests
| --------------------------------------------------------------------------------
* @param {Object} req the data of request app
* @param {Object} res the data of response app
*/
exports.signin = function(req, res) 
{
    var username = req.body.username || '';
    var password = req.body.password || '';
    User.findAndAuthenticate({username: username, password:password}, (err, user) =>
    {
        if (err){
            return res.status(err.status || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        // var expires = moment().add(7,'days').valueOf();
        var expires = moment().add(1,'minute').valueOf();
        var token = jwt.encode({
            iss: user.id,
            exp: expires
        }, credentials.mySecret);

        user.updateToken(token, expires, (err,u) =>{
            if(err){
                return res.status(500).send({
                    message: help.getErrorMessage(err)
                });
            }
            //user.profile = `${credentials.s3_url}${credentials.s3_bucket}/${user.profileImage}`;
            return res.json({user: u.toJSON()});
        });
    });
};

/**
| --------------------------------------------------------------------------------
| Run the logout with the app device, connected with jwt
| --------------------------------------------------------------------------------
* @param {Object} req the data of request app
* @param {Object} res the data of response app
*/
exports.signout = function(req, res)
{
    req.user.updateToken(null, null, (err,u) =>{
        if(err){
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        jwt.encode(null, credentials.mySecret);
        return res.json({user: u.toJSON()});
    });
};

/**
 | --------------------------------------------------------------------------------
 | Syncronize data sent of device app with server
 | --------------------------------------------------------------------------------
 * 
 */
exports.sync = function(req,res)
{
    var post = req.body.task;
    var task = new Task(req.body);
    task.sync_date = new Date();
    task.userId = req.user;

    task.save((err, t) =>{
        if (err)
        {
            return res.status(400).send({
                message: help.getErrorMessage(err)
            });
        }

        res.json({task: t});
    })

};