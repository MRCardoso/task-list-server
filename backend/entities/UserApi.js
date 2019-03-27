const Validator = require('../modules/Validator')
const Model = require('../modules/Model')
const User = require('./User')

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key of the table
 * @property {int} userId the user foreign of this model
 * @property {string} name the name of this model record
 * @property {string} version the version of this model record
 * @property {int} platform the platform of this model (1 - web, 2 - mobile, 3 third part)
 * @property {string} token the token generated in the login
 * @property {number} expires the expires timestamp of the token
 * @property {Date} created_at the date of creation of user
 * @property {Date} updated_at the date of last update of data the user
 */
class UserApi extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "name", "version", "platform", "token", "expires", "created_at"]
        super(app, "users_api", {}, fillables)
        this.timestamps = false
    }

    relations(alias) {
        let relations = {
            "user": ["users", "userId", ["user.name", "user.email", "user.status", "user.admin"], false, true],
        };
        return relations[alias]
    }

    /**
     * ----------------------------------------------------------------------------
     * Method to make login in the app, create a token and expires
     * and save in table to user found by email in post
     * ----------------------------------------------------------------------------
     * @param {object} post the post data of request
     * @param {string} post.email the email of user to make login
     * @param {string} post.password the password to be update
     * @returns {Promise}
     */
    login(post) {
        return new Promise((resolve, reject) => {
            const user = new User(this.app)
            this.validator = new Validator({
                "username": user.rules.username,
                "password": user.rules.password,
            })

            if (!this.validator.validate(post)) {
                return reject(is400(this.validator.getErrors()))
            }

            user.one({ username: post.username }, ["image"], true).then(logged => {
                const bcrypt = require('bcrypt-nodejs')
                const isMatch = bcrypt.compareSync(post.password, logged.password)
                if (!isMatch) {
                    return reject(is400({ password: ["Senha inválida"] }))
                }
                resolve(logged)
            }).catch(err => reject(err))
        })
    }

    /**
     * ----------------------------------------------------------------------------
     * Method to make logout in the app, remove record in table
     * and clear jwt token
     * ----------------------------------------------------------------------------
     * @param {object} id the id of the users_api created in the login
     * @param {string} userId the id of user that request logout
     * @returns {Promise}
     */
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
    /**
     * ----------------------------------------------------------------------------
     * Delete a api by your token
     * ----------------------------------------------------------------------------
     * @param {string} token the token to be delete the api
     */
    removeByToken(token){
        if(!token){
            return Promise.resolve()
        }
        return this.delete({token})
    }

    /**
     * ----------------------------------------------------------------------------
     * Method to find a api of user by the token generated in the login
     * ----------------------------------------------------------------------------
     * @param {string} token the id of user that request logout
     * @returns {Promise}
     */
    getApiByToken(token) {
        let post = { token }
        this.validator = new Validator({"token": "required"})

        if (!this.validator.validate(post)) {
            return Promise.reject(is400(this.validator.getErrors()))
        }

        return this.one(post, ["user"])
    }

    /**
     * ----------------------------------------------------------------------------
     * Method create a record in this.table to user founded
     * ----------------------------------------------------------------------------
     * @param {object} logged the data of the user to create a api/login jwt
     * @param {string} name the name of origin where the app was created
     * @param {string|int} version the version of origin where the app was created
     * @param {int} platform the platform where this api was created
     * @returns {Promise}
     */
    createApi(logged, name, version, platform = 1) {
        return new Promise((resolve, reject) => {
            if (!logged.status) {
                return reject(is401("Usuário inativo"))
            }
            this.validator = new Validator({
                "userId": "required|number",
                "name": "required|max:250",
                "version": "required|max:250",
                "platform": "required|number",
                "token": "required",
                "expires": "required|number"
            })
            const { createTokenPayload } = require("../modules/Utils")
            let { token, expires, payload } = createTokenPayload(logged, platform)
            let post = { userId: logged.id, token, name, version, platform, expires, created_at: new Date()}

            if (!this.validator.validate(post)) {
                return reject(is400(this.validator.getErrors()))
            }
            
            this.save(post)
                .then(id => resolve({ authToken: { ...payload, token, apiId: id}, ...logged }))
                .catch(err => reject(err))
        })
    }

    /**
     * ----------------------------------------------------------------------------
     * Method to re-create a new record in this.table 
     * by id of the user that previous make login
     * ----------------------------------------------------------------------------
     * @param {int} id the id of the user to do the login
     * @param {string} name the name of origin where the app was created
     * @param {string|int} version the version of origin where the app was created
     * @param {int} platform the platform where this api was created
     * @returns {Promise}
     */
    refrashLogin(id, name, version, platform = 1) {
        return new Promise((resolve, reject) => {
            const user = new User(this.app)

            user.one({ id }, ["image"])
                .then(logged => {
                    this.createApi(logged, name, version, platform)
                        .then((apiData) => resolve(apiData))
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
        })
    }
}

module.exports = UserApi