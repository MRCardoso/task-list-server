const { authSecret } = require('../.env')
const jwt = require('jwt-simple')

module.exports = app => {
    const User = require('../entities/User')
    const user = new User(app);

    const signin = async (req, res) => {
        if( !req.body.email || !req.body.password){
            return res.status(400).send({message: ["Please provider the email and password"]})
        }

        const logged = await user.findByEmail(req.body.email)

        if(!user) {
            return req.status(400).send({message: ["User not found"]})
        }
        const bcrypt = require('bcrypt-nodejs')
        const isMatch = bcrypt.compareSync(req.body.password, logged.password)
        if(!isMatch) return res.status(401).send({message: ["Password invalid"]})
        
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
    }

    return { signin }
}