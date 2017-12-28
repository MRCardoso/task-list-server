'use strict';

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

/**
 * Create a Schema of the table 'User'
 * */
var UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/,"Por favor preencha um endereço de E-mail válido!"],
        default: ''
    },
    username: {
        type: String,
        unique: true,
        required: "O campo usuário é obrigatório!",
        trim: true
    },
    password: {
        type: String,
        required: "O campo senha é obrigatória!",
        validate: [
            function(password)
            {
                return password && password.length > 6;
            }, "A senha deve ter mais de 6 caracteres!"
        ]
    },
    status: {
        type: Number,
        default: 1 // 1 - active | 0 - inactive
    },
    profileImage: {
        type: String,
        default: null
    },
    authToken: {
        type: String,
        default: null,
    },
    authTokenExpires: {
        type: Number,
        default: null,
    },
    created:{
        type: Date,
        default: Date.now
    },
});
/**
 * method pre('save')
 * set a hash to password only in insert
 */
UserSchema.pre('save', function(next)
{
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(5, function(err, salt) {
        if (err) 
            return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/**
 * method authenticate
 * to validation of the password the user
 * @param password
 */
UserSchema.methods.authenticate = function(password, next) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) 
            return next(err);
        next(isMatch);
    });
};

/**
 * find a user by username and validate password in hash
 * @param {Object} credentials the object with login data
 * @param {string} credentials.username the username to be found
 * @param {string} credentials.password the password to be found
 * @param {function} next the callback function called when success and fail
 */
UserSchema.statics.findAndAuthenticate = function(credentials,next)
{
    var validations = [];
    if (credentials && credentials.username == '')
        validations.push({message: `The username is required!`});

    if (credentials && credentials.password == '')
        validations.push({message: `The password is required!`});

    if(validations.length>0){
        return next({errors: validations, status: 400},null);
    }

    this.findOne({username: credentials.username}, function (err, user) 
    {
        if (err){
            return next(err, null);
        }
        if(!user){
            return next({errors: [{message:`The user '${credentials.username}' not found`}], status: 404}, null);
        }
        user.authenticate(credentials.password, function(isMatch)
        {
            if (!isMatch) {
                return next({errors: [{message:`Invalid Password!`}], status: 400}, null);
            }

            return next(false, user);
        });
    });
};
/**
 * method findUniqueUsername
 * verify if username already exists
 * join with suffix the username
 * use the method findOne of the mongoose
 * if username don't exist, execute the callback
 * @param username
 * @param next the callback function called when success and fail
 */
UserSchema.statics.findUniqueUsername = function(username, next)
{
    this.findOne({username: username}, (err, user) =>{
        var error = {
            errors: {
                username: {
                    message: `This user [${username}] alredy exists!`
                }
            }
        };
        if( err || user ){
            return next((err || error), user);
        }

        return next(false, null);
    });
};

UserSchema.statics.findByToken = function(token, next)
{
    if( token == null || token == undefined || token == '' ){
        return next({errors: [{message:`Token is required!`}], status: 400}, null);
    }
    this.findOne({authToken: token}, (err, user)=>{
        if(err)
        {
            next(err,null);
        }
        if(!user){
            return next({errors: [{message:`The token not found`}], status: 404}, null);
        }
        return next(false, user);
    });
};

/**
 * Update the token and expires date of the load user
 * @param {string} token the token to be save of the load user
 * @param {int} expires the data of expiration for this token
 * @param {function} next the callback function called when success and fail
 */
UserSchema.methods.updateToken = function(token, expires, next)
{
    this.authToken = token;
    this.authTokenExpires = expires;
    this.save((err,user)=>{
        return next(err, user);
    });
};

/**config 'UserSchema' for use getters and virtuals when is transformed in JSON*/
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
/**create the model by UserSchema*/
mongoose.model('User', UserSchema);