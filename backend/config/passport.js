const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt} = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken({ failmessage: 'missing token' })
    }

    const strategy = new Strategy(params, (payload, done) => {
        const User = require('../entities/User')
        const user = new User(app)

        user.one({ id: payload.id }, ['image'])
            .then(u => done(null, (u ? { authToken: { ...payload }, ...u } : false)))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}