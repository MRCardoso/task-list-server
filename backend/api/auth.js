const { authSecret } = require('../.env')
const jwt = require('jwt-simple')

module.exports = app => {
    const Auth = require('../entities/Auth')
    const auth = new Auth('signin',app);

    const signin = async (req, res) => {
        try {
            auth.login(req.body).then((logged) => {
                const now = Math.floor(Date.now() / 1000)
                const payload = {
                    id: logged.id,
                    email: logged.email,
                    username: logged.username,
                    iat: now,
                    exp: now + (60 * 60 * 24 * 3)
                }
    
                res.json({
                    ...payload,
                    token: jwt.encode(payload, authSecret)
                })
            }, (err) => {
                res.status(err.status).send({ validations: err.message })
            })
        } catch (error) {
            console.log({error})
            res.status(500).send("Não foi possível fazer login")
        }
    }

    const validateToken = async (req, res) => {
        try {
            if (req.body.token) {
                const token = jwt.decode(req.body.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            console.log({ e })
        }

        res.send(false)
    }

    return { signin, validateToken }
}