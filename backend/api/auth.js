const { authSecret, resetToken, endpoint, MAIL, AWS, logoHeader, logoFooter } = require('../.env')
const { prepareResponse, sendMail, cleanToken, expiredToken } = require('mcarz-back-utils')

module.exports = app => {
    const Auth = require('../entities/UserApi')
    const auth = new Auth(app)

    const User = require('../entities/User')
    const user = new User(app)

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to verify if the token of current web browser is valid and not expires
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const validateToken = async (req, res) => {
        let apiData

        try {
            const next = (p) => auth.one(p, ["user"])
            apiData = await auth.api.getByToken(next, req.body.token || '')
        } catch (error) {
            return res.status(401).send("token não encontrado")
        }

        try {
            expiredToken(req.body.token, authSecret)
            res.send(apiData)
        } catch (e) {
            console.log({ e })
            auth.logout(apiData.id, apiData.userId)
                .then(() => res.status(401).send({ message: 'Token expirado, por favor faça o login novamente' }))
                .catch(err => prepareResponse(res, err))
        }
    }

    /**
    * ----------------------------------------------------------------------------
    * Endpoint to recreate the api token and redo the login
    * ----------------------------------------------------------------------------
    * @param {object} req the object with request information(input)
    * @param {object} res the object with response information(output)
    */
    const refrashToken = (req, res) => {
        if (!req.body.id) {
            return res.status(400).send("Usuário não fornecido")
        }

        auth.api
            .removeByToken(req.body.token || '')
            .finally(_ => {
                const next = () => user.one({ id: req.body.id }, ["image"])
                auth.createApi(next, req.query)
                    .then(updated => res.json({ updated }))
                    .catch(err => prepareResponse(res, err))
            })
    }

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to make login by JWT, and register the users_api to request user
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
     */
    const signin = async (req, res) => {
        auth.createApi(() => user.login(req.body, ["image"]), req.query)
            .then(apiData => res.json(apiData))
            .catch(err => prepareResponse(res, err))
    }

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to make logout by JWT in the application
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
    */
    const signout = (req, res) => {
        auth.api
            .remove(req.params.apiId, req.params.id, () => cleanToken({ authSecret }))
            .then(deleted => res.json({ deleted }))
            .catch(err => prepareResponse(res, err))
    }

    /**
     * ----------------------------------------------------------------------------
     * Endpoint to send email with token to recovery password
     * ----------------------------------------------------------------------------
     * @param {object} req the object with request information(input)
     * @param {object} res the object with response information(output)
    */
    const forgot = async (req, res) => {
        try {
            const data = await user.findByEmail(req.body.email)
            const reseted = await user.updateResetToken(data.id, resetToken)

            const url = `${endpoint}reset/${reseted.token}`;
            const moment = require('moment')
            const title = 'Token de Recuperação de senha'
            const content = `
                {strong}Token:{/strong}{br}
                {a href="${url}" title="token"}Clique aqui{/a}{br}
                ou cole este link em seu navegador: ${url}
                {br}
                {p}
                    {strong}Token expira em: {/strong}
                    {i}${moment(reseted.expires).format('DD/MM/YY HH:mm:ss')}{/i}
                {/p}
            `
            const params = {
                mail: data.email,
                subject: "Token de Recuperação de senha.",
                content: await require('../config/mail')(title, content)
            }
            sendMail(params, MAIL.adminMail, MAIL.apiKey)
                .then(info => res.json({ success: "Token enviado com sucesso", info }))
                .catch(err => prepareResponse(res, err))
        } catch (err) {
            prepareResponse(res, err)
        }
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
                    .catch(err => prepareResponse(res, err))
            })
            .catch(err => prepareResponse(res, err, "Token não encontrado ou expirado"))
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
            return res.status(403).send('Usuário não tem permissão de acesso.')
        }
        next()
    }

    return { signin, signout, forgot, reset, refrashToken, validateToken, isAdmin }
}