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
            return res.status(err.sCode || 500).send({
                message: help.getErrorMessage(err)
            });
        }
        let [m, s] = (credentials.authToken || [1, 'hour']);
        var expires = moment().add(m,s).valueOf();
        var token = jwt.encode({iss: user.id, exp: expires}, credentials.secretAuthToken);

        user.createApiToken({
            token: token,
            expires: expires,
            name: (req.query.PlatformName || null),
            version: (req.query.PlatformVersion || ''),
            platform: (req.query.PlatformOrigin || null)
        }, (err,userApi) =>{
            if(err){
                return res.status(400).send({
                    message: help.getErrorMessage(err)
                });
            }
            let rJson = user.toJSON();
            rJson.authToken = userApi.token;
            rJson.authExpires = userApi.expires;
            rJson.url = `http:${credentials.s3Url}${credentials.s3Bucket}/${credentials.s3ImagePath}/${user._id}/${user.image.path}`;
            return res.json({ user: rJson });
            // var request = require('request').defaults({ encoding: null });
            // request.get(user.url, function (err, response, buffer) {
            //     //process exif here
            //     user.url = "data:image/jpeg;base64,"+(new Buffer(buffer).toString('base64'));
            //     return res.json({ user: user });
            // });
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
    req.user.removeApiToken(err =>{
        if(err){
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        jwt.encode(null, credentials.secretAuthToken);
        return res.json({user: null});
    });
};

/**
 | --------------------------------------------------------------------------------
 | Load all task that was sync with server by device id
 | --------------------------------------------------------------------------------
 * @param {Object} req the data of request app
 * @param {Object} res the data of response app
 */
exports.list = function (req, res) {
    Task.find({ userId: req.user.id })
    .populate('integrationApiId', '_id platform description created removed updated')
    .exec((err, tasks) => {
        if (err) {
            return res.status(400).send({ message: help.getErrorMessage(err) });
        }
        var result = tasks
            // .filter(r => (r.integrationApiId != null && r.integrationApiId.platform == MOBILE))
            .map(r => {
                return {
                    id_task_reference: r._id,
                    title: r.title,
                    description: r.description,
                    priority: r.priority,
                    situation: r.situation,
                    status: r.status,
                    created: r.created,
                    start_date: r.startDate,
                    end_date: r.endDate
                };
            });

        return res.json(result);
    });
};