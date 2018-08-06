let passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    credentials = require('../../config/credentials'),
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new FacebookStrategy({
        clientID: credentials.facebook.clientID,
        clientSecret: credentials.facebook.clientSecret,
        callbackURL: credentials.facebook.callbackURL,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        var key = Math.floor(Math.random() * Date.now()) + 90000;

        User.findByOAuth({
            name: profile.displayName,
            username: `${profile.displayName.replace(/( )/, '_')}_${key}`,
            provider: 'facebook',
            providerId: profile.id,
            providerData: providerData
        }, (err, user) => {
            if(err){
                req.flash('error', require('../../app/helpers').getErrorMessage(err, false));
                return done(null, null);
            }
            done(null, user);
        });
    }));
};