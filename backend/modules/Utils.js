exports.generateFileString = name => {
    const crypto = require('crypto')
    let date = new Date()
    let string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${name}`
    return crypto.createHash('md5').update(string).digest('hex') + '.' + name.split('.').pop()
}

exports.createTokenPayload = (logged, keepLogin) => {
    let { authSecret } = require('../.env')
    let jwt = require('jwt-simple')

    let now = Math.floor(Date.now() / 1000)
    let expires = now + (60 * 60 * 24 * 3)

    let payload = {
        id: logged.id,
        email: logged.email,
        username: logged.username,
        admin: logged.admin,
        image: logged.image || null,
        keepLogin,
        iat: now,
        exp: expires
    }
    let token = jwt.encode(payload, authSecret)

    return { token, expires, payload }
}

exports.prepareError = error => {
    let reason = {}
    if(typeof error === "object"){
        if (error.sqlMessage && error.sql){
            reason = { status: 500, message: "Código #0001 não foi possível persistir dados"}
        } else if (error.Validator){
            reason = { status: 400, message: { validations: error.Validator }}
        } else if (error.Unauthorized){
            reason = { status: 401, message: {validations: error.Unauthorized}}
        } else if (error.Forbbiden) {
            reason = { status: 403, message: error.Forbbiden }
        } else if (error.Notfound) {
            reason = { status: 404, message: error.Notfound }
        }
    } else{
        reason = { status: 500, message: "Erro desconhecido" }
    }
    console.log(error)
    return reason
}

exports.responseErr = (response, error, defError = null) => {
    let { status, message } = exports.prepareError(error)
    return response.status(status).send(defError || message)
}