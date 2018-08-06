var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function ()
{
    passport.use(new LocalStrategy((username, password, done) => {
        User.findAndAuthenticate({username: username, password:password}, (err, user) =>{
            if(err){
                return done(null,false, {
                    message: require('../../app/helpers').getErrorMessage(err,false)
                });
            }
            return done(null,user);
        });
    }));
};