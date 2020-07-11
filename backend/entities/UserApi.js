const { Model, Api, createToken } = require('mcarz-back-utils')

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
        this.api = new Api(this)
    }

    relations(alias) {
        let relations = {
            "user": ["users", "userId", ["user.name", "user.email", "user.status", "user.admin"], false, true],
        };
        return relations[alias]
    }

    /**
     * ----------------------------------------------------------------------------
     * Method create a record in this.table to user founded
     * ----------------------------------------------------------------------------
     * @param {*} next the promisse with load user
     * @param {object} params the name of origin where the app was created
     * @param {string} params.name the name of origin where the app was created
     * @param {number} params.version the version of origin where the app was created
     * @param {number} params.platform the platform where this api was created
     * @returns {Promise}
     */
    createApi(next, params) {
        const post = {
            name: params.PlatformName || '',
            version: params.PlatformVersion || 0,
            platform: params.PlatformOrigin || PLATFORM_WEB,
        }
        const rules = {
            "name": "required|max:250",
            "version": "required|max:250",
            "platform": "required|number",
        }
        const middleware = ({ id }) => createToken(require('../.env'), { id, platform: post.platform })
        return this.api.add(post, rules, next, middleware)
    }
}

module.exports = UserApi