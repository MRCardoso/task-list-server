const Validator = require('../modules/Validator')
const Model = require('../modules/Model')
const { createTokenPayload } = require("../modules/Utils")
const User = require('./User')
const Image = require('./Image')


let { authSecret } = require('../.env')
let jwt = require('jwt-simple')

class UserApi extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "name", "version", "platform", "token", "expires", "keepLogin"]
        super(app, "users_api", {}, fillables)
        this.timestamps = false
    }

    relations(alias) {
        let relations = {
            "users": ["users", "id", "userId", ["users.name", "users.email"]]
        };
        return relations[alias]
    }

    login(post) {
        return new Promise((resolve, reject) => {
            this.validator = new Validator({
                "email": "required|email",
                "password": "required|min:8|max:255",
            })

            if (!this.validator.validate(post)) {
                return reject({ Validator: this.validator.getErrors() })
            }

            const user = new User(this.app)
            const image = new Image(this.app)

            user.one({ email: post.email }, [], true).then(logged => {
                const bcrypt = require('bcrypt-nodejs')
                const isMatch = bcrypt.compareSync(post.password, logged.password)
                if (!isMatch) {
                    return reject({ Validator: { password: ["Senha inválida"] }})
                }
                image.imageByUser(logged.id).then( i => {
                    logged.image = i
                    resolve(logged)
                })
            }).catch(err => {
                console.log({ err })
                return reject({ Unauthorized: { email: ["Usuário não encontrado"] } })
            })
        })
    }

    logout(id, userId) {
        return new Promise((resolve, reject) => {
            let { authSecret } = require('../.env')
            let jwt = require('jwt-simple')

            jwt.encode(null, authSecret);

            this.delete({ id, userId })
                .then(deleted => resolve(deleted))
                .catch(error => reject(error))
        })
    }

    getApiByToken(token) {
        return new Promise((resolve, reject) => {
            this.one({ token })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    createApi(logged, name, version, platform = 1, keepLogin = false) {
        return new Promise((resolve, reject) => {
            this.validator = new Validator({
                "userId": "required|number",
                "name": "required|max:250",
                "version": "required|max:250",
                "platform": "required|number",
                "token": "required",
                "expires": "required|number"
            })

            let { token, expires, payload } = createTokenPayload(logged, keepLogin)
            let post = { userId: logged.id, token, name, version, platform, expires, keepLogin, created_at: new Date()}

            if (!this.validator.validate(post)) {
                return reject({ Validator: this.validator.getErrors()})
            }
            
            this.save(post)
                .then(id => resolve({ ...payload, token, apiId: id }))
                .catch(err => reject(err))
        })
    }

    refrashLogin(id, name, version, platform = 1, keepLogin = false) {
        return new Promise((resolve, reject) => {
            const user = new User(this.app)
            const image = new Image(this.app)

            user.one({ id })
            .then(logged => {
                image.imageByUser(logged.id)
                    .then(i => {
                        logged.image = i
                        this.createApi(logged, name, version, platform, keepLogin)
                            .then((apiData) => resolve(apiData))
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
        })
    }
}

module.exports = UserApi