let passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    credentials = require('../../config/credentials'),
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID: credentials.google.clientID,
        clientSecret: credentials.google.clientSecret,
        callbackURL: credentials.google.callbackURL,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        
        var key = Math.floor(Math.random() * Date.now()) + 90000;

        User.findByOAuth({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: `${profile.displayName.replace(/( )/, '_')}_${key}`,
            provider: 'google',
            providerId: profile.id,
            providerData: providerData
        }, (err, user) => {
            if (err) {
                req.flash('error', require('../../app/helpers').getErrorMessage(err, false));
                return done(null, null);
            }
            done(null, user);
        });
    }));
};