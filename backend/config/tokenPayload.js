const datesExpires = (expires, def = 60) => {
    let now = Math.floor(Date.now()/1000)
    return { now, expires: (now + (expires || def))}
}

const createTokenPayload = (logged, platform) => {
    let { authSecret, authToken } = require('../.env')
    let { now, expires } = datesExpires(authToken)
    let jwt = require('jwt-simple')

    let payload = {
        id: logged.id,
        platform,
        iat: now,
        exp: expires
    }
    let token = jwt.encode(payload, authSecret)

    return { token, expires, payload }
}

module.exports = createTokenPayload