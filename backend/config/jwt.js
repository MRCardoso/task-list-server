module.exports = app => {
    return {
        authenticate: async (req,res, next) => {
            const { authSecret } = require('../.env')
            const { responseErr } = require("../modules/Utils")
            const jwt = require('jwt-simple')
            const Auth = require('../entities/UserApi')
            const auth = new Auth(app)
            const User = require('../entities/User')
            const user = new User(app)

            let apiData
            let matches = (req.headers['authorization'] || '').match(/(\S+)\s+(\S+)/)

            if (!matches[2]) {
                return res.status(401).send({ message: "token não informado" })
            }

            let token = matches[2]

            try {
                apiData = await auth.getApiByToken(token)
            } catch (error) {
                return res.status(401).send({ message: "token não encontrado" })
            }

            try {
                let payload = jwt.decode(token, authSecret);

                if (!payload) {
                    throw "Falha ao processar o token"
                }
                if (new Date(payload.exp) < new Date()) {
                    throw "Token expirado!"
                }

                let logged = await user.one({ id: payload.id }, ['image'])
                req.user = { authToken: { ...payload }, ...logged }
                next()
            } catch (e) {
                console.log({ tokenErr: e })

                auth.logout(apiData.id, apiData.userId)
                    .then(() => { })
                    .catch(err => responseErr(res, err))
                    .finally(_ => res.status(401).send({ message: 'Token expirado, por favor faça o login novamente' }))
            }
        }
    }
}