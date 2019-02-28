const Validator = require('../modules/Validator')
const Model = require('../modules/Model')

class UserApi extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "name", "version", "platform", "token", "expires", "created_at"]
        super(app, "users_api", {}, fillables)
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
                return reject({ status: 400, message: this.validator.getErrors() })
            }

            const User = require('./User')
            const Image = require('./Image')

            const user = new User(this.app)
            const image = new Image(this.app)

            user.one({ email: post.email }, [], true).then(logged => {
                const bcrypt = require('bcrypt-nodejs')
                const isMatch = bcrypt.compareSync(post.password, logged.password)
                if (!isMatch) {
                    return reject({ status: 401, message: { password: ["Password invalid"] } })
                }

                image.one({ userId: logged.id })
                    .then(i => {
                        let { AWS } = require('../.env')
                        logged.image = `${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}/${logged.id}/${i.name}`
                        resolve(logged)
                    })
                    .catch(() => resolve(logged))
            }).catch(err => {
                console.log({ err })
                return reject({ status: 401, message: { email: ["User not found"] } })
            })
        })
    }

    getApiByToken(token) {
        return new Promise((resolve, reject) => {
            this.one({ token })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    createApi(logged, name, version, platform = 1) {
        return new Promise((resolve, reject) => {
            this.validator = new Validator({
                "userId": "required|number",
                "name": "required|max:250",
                "version": "required|max:250",
                "platform": "required|number",
                "token": "required",
                "expires": "required|number"
            })

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
                iat: now,
                exp: expires
            }
            let token = jwt.encode(payload, authSecret)

            let post = {
                userId: logged.id, token, name, version, platform, expires
            }

            if (!this.validator.validate(post)) {
                return reject(this.validator.getErrors())
            }
            
            this.save(post)
                .then(id => resolve({ ...payload, token, apiId: id }))
                .catch(err => reject(err))
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
}

module.exports = UserApi