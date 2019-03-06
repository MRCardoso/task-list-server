const { authSecret, endpoint, MAIL } = require('../.env')
const { responseErr, sendMail } = require("../modules/Utils")
const jwt = require('jwt-simple')

module.exports = app => {
    const Auth = require('../entities/UserApi')
    const auth = new Auth(app)

    const User = require('../entities/User')
    const user = new User(app)

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to make login by JWT, and register the users_api to request user
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
     */
    const signin = async (req, res) => {
        try {
            auth.login(req.body).then(logged => {
                let keepLogin = req.body.keepLogin || false
                let PlatformName = req.query.PlatformName || '' 
                let PlatformVersion = req.query.PlatformVersion || 0

                auth.createApi(logged, PlatformName, PlatformVersion, PLATFORM_WEB,keepLogin)
                    .then((apiData) => res.json(apiData))
                    .catch(err => responseErr(res, err))
            }, err => responseErr(res, err))
        } catch (error) {
            responseErr(res, error, "Não foi possível fazer login")
        }
    }

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to make logout by JWT in the application
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
    */
    const signout = (req, res) => {
        auth.logout(req.params.id, req.user.id)
            .then((deleted) => res.json({ deleted}))
            .catch(err => responseErr(res, err))
    }

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to send email with token to recovery password
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
    */
    const forgot = (req, res) => {
        user.findByEmail(req.body.email)
        .then(data => {
            user.updateResetToken(data.id)
            .then(token => {
                let url = `${endpoint}reset/${token}`;

                sendMail({
                    mail: data.email,
                    title: 'Token de Recuperação de senha',
                    subject: "Token de Recuperação de senha.",
                    content: `
                        {strong}Token:{/strong}{br}
                        {a href="${url}" title="token"}Clique aqui{/a}{br}
                        ou cole este link em seu navegador: ${url}
                    `
                }, MAIL)
                .then(_ => res.json({ success: "Token enviado com sucesso" }))
                .catch(err => responseErr(res, err))
            })
            .catch(err => responseErr(res, err))
        })
        .catch(err => responseErr(res, err, "E-mail não encontrado"))
    }
    
    /**
    * ----------------------------------------------------------------------------
    * Endpoint to reset the password to user founded in the token on request
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const reset = (req, res) => {
        user.findByResetToken(req.params.token)
            .then(u => {
                user.updatePassword(req.body, u.id)
                    .then(updated => res.json({ updated }))
                    .catch(err => responseErr(res, err))
            })
            .catch(err => responseErr(res, err, "Token não encontrado ou expirado"))
    }

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to recreate the api token and redo the login
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const refrashToken = (req, res) => {
        if (!req.body.id){
            return res.status(400).send("Usuário não fornecido")
        }
        
        let keepLogin = req.body.keepLogin || false
        let PlatformName = req.body.PlatformName || ''
        let PlatformVersion = req.body.PlatformVersion || 0
        
        auth.refrashLogin(req.body.id, PlatformName, PlatformVersion, 1, keepLogin)
            .then(updated => res.json({ updated }))
            .catch(err => responseErr(res, err))
    }

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to verify if the token of current web browser is valid and not expires
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const validateToken = async (req, res) => {
        if (!req.body.token) {
            return res.status(400).send("Token não informado!")
        }

        try {
            const token = jwt.decode(req.body.token, authSecret)
            console.log(`NOW: ${new Date()}`)
            
            if (new Date(token.exp) < new Date()) {
                throw "Token expirado"
            }

            let apiData = await auth.getApiByToken(req.body.token, token.exp)
            if (!apiData){
                throw "token não encontrado"
            }
            res.send(apiData)
        } catch (e) {
            console.log({e})
            let message = 'Token expirado, por favor faça o login novamente'
            if (!req.body.apiId || !req.body.userId){
                return res.status(401).send(message)
            }
            auth.logout(req.body.apiId, req.body.userId)
                .then(() => res.status(401).send(message))
                .catch(err => responseErr(res, err))
        }
    }

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to verify if the reset token is valid
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const validateResetToken = (req, res) => {
        user.findByResetToken(req.params.token, false)
            .then(u => res.json(u))
            .catch(err => responseErr(res, err, "Token não encontrado ou expirado"))
    }

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to verify if the auth user has admin permission
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    * @param {object} next
    */
    const isAdmin = (req, res, next) => {
        if (!req.user.admin) {
            return res.status(401).send('Usuário não tem permissão de acesso.')
        }
        next()
    }

    return { signin, signout, forgot, reset, refrashToken, validateToken, validateResetToken, isAdmin }
}