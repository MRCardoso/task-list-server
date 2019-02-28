const { authSecret } = require('../.env')
const jwt = require('jwt-simple')

module.exports = app => {
    const Auth = require('../entities/UserApi')
    const auth = new Auth(app);

    const signin = async (req, res) => {
        try {
            auth.login(req.body).then(logged => {
                auth.createApi(logged, (req.query.PlatformName || ''), (req.query.PlatformVersion || 0))
                    .then((apiData) => res.json(apiData))
                    .catch(err => {
                        res.status(400).send({ validations: err })
                    })
            }, (err) => {
                res.status(err.status).send({ validations: err.message })
            })
        } catch (error) {
            res.status(500).send("Não foi possível fazer login")
        }
    }

    const signout = (req, res) => {
        auth.logout(req.params.id, req.user.id)
            .then((deleted) => res.json({ deleted}))
            .catch(err => res.status(500).send(err))
    }

    const validateToken = async (req, res) => {
        if (!req.body.token) {
            return res.status(400).send("Token não informado!")
        }

        try {
            const token = jwt.decode(req.body.token, authSecret)
            
            if (new Date(token.exp * 1000) < new Date()) {
                throw "Token expirado"
            }

            let apiData = await auth.getApiByToken(req.body.token, token.exp)
            if (!apiData){
                throw "token não encontrado"
            }
            res.send(apiData)
        } catch (e) {
            let message = 'Token expirado, por favor faça o login novamente'
            if (!req.body.apiId || !req.body.userId){
                return res.status(401).send(message)
            }
            auth.logout(req.body.apiId, req.body.userId)
                .then(() => res.status(401).send(message))
                .catch(err => res.status(500).send(err))
        }
    }

    const isAdmin = (req, res, next) => {
        if (!req.user.admin) {
            return res.status(401).send('Usuário não tem permissão de acesso.')
        }
        next()
    }

    return { signin, signout, validateToken, isAdmin }
}