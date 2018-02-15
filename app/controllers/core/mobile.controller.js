var User = require('mongoose').model('User'), 
    Task = require('mongoose').model('Task'), 
    jwt = require('jwt-simple'), 
    moment = require('moment'),
    help = require('../../helpers'),
    credentials = require('../../../config/credentials');

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
            return res.status(err.sCode || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        // var expires = moment().add(7,'days').valueOf();
        let [m, s] = (credentials.authToken || [1, 'hour']);
        var expires = moment().add(m,s).valueOf();
        var token = jwt.encode({
            iss: user.id,
            exp: expires
        }, credentials.secretAuthToken);

        user.updateAuthToken(token, expires, (err,u) =>{
            if(err){
                return res.status(400).send({
                    message: help.getErrorMessage(err)
                });
            }
            let user = u.toJSON();
            user.url = `${credentials.s3Url}${credentials.s3Bucket}/${credentials.s3ImagePath}/${user._id}/${user.image.path}`;
            console.log(user)
            return res.json({user:user});
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
    req.user.updateAuthToken(null, null, (err,u) =>{
        if(err){
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        jwt.encode(null, credentials.secretAuthToken);
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
    var task = new Task(req.body);
    task.platform_origin = MOBILE;
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
    });
};

/**
 | --------------------------------------------------------------------------------
 | Load all task that was sync with server by device id
 | --------------------------------------------------------------------------------
 * @param {Object} req the data of request app
 * @param {Object} res the data of response app
 */
exports.list = function(req,res){
    Task.find({
        platform_origin: MOBILE,
        userId: req.user.id
    }, (err, tasks) => {
        if (err)
        {
            return res.status(400).send({
                message: help.getErrorMessage(err)
            });
        }

        return res.json(tasks)
    })
}