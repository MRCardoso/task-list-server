const Validator = require('../modules/Validator')
const Model = require('../modules/Model')

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key of the table
 * @property {string} name the name of the user
 * @property {string} username the username of the user
 * @property {string} email the email of the user
 * @property {string} password the password of the user
 * @property {bool} status the status of the user
 * @property {bool} admin the user is administrator in the app
 * @property {string} resetToken the token of recovery password
 * @property {number} resetExpires the expires timestamp of the token
 * @property {Date} deleted_at the date of the inactivate the user
 * @property {Date} created_at the date of creation of user
 * @property {Date} updated_at the date of last update of data the user
 */
class User extends Model {
    constructor(app){
        const fillables = ["id", "name", "username", "email", "status", "admin"]
        const hiddens = ["password"]
        const rules = {
            "name"          : "required|max:80",
            "username"      : "required|min:5|max:80|vusername",
            "email"         : "required|mail|max:120",
            "password"      : "required:create|min:8|max:80",
            "confirmation"  : "required:create|min:8|max:80|compare:password",
            "status"        : "number"
        }
        super(app, "users", rules, fillables, hiddens)
    }

    static active(){ return 1; }
    static inactive(){ return 0; }

    beforeSave() {
        return new Promise((resolve, reject) => {
            if (this.id && !this.password) {
                delete this.attributes["password"]
            } 
            else if (this.password){
                const bcrypt = require('bcrypt-nodejs')
                const salt = bcrypt.genSaltSync(10)
                
                this.password = bcrypt.hashSync(this.password, salt)
                this.attributes["password"] = this.password
            }
            if (this.status == null || this.status == undefined){
                delete this.attributes["status"]
            } else{
                this.status = (this.status == "1" || this.status == "true") ? true : false
                this.attributes["status"] = this.status
            }
            
            this.uniqueUser()
                .then(_ => reject(this.validator.processMessages("unique", { field: "username/email" })))
                .catch(err => (typeof err === "string" ? resolve() : reject(err)))
        })
    }

    relations(alias) {
        let { AWS } = require('../.env')
        
        let relations = {
            "image": [
                "images", //FK table
                "userId", // FK column
                [ // fk fields
                    "id", "userId", "name", 
                    this.app.db.raw(`CONCAT("${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}", "/", userId, "/",name) as url`)
                ]
            ],
            "apis": ["users_api", "userId", "*", true]
        };
        return relations[alias]
    }

    /**
    * ----------------------------------------------------------------------------
    * Method to use select one default of the App, filter by email of user
    * validate of the email was informed
    * ----------------------------------------------------------------------------
    * @param {string} email the email to be find the user
    * @param {bool} active validation to find user only active status
    * @returns {Promise}
    */
    findByEmail(email, active = true){
        let post = { email }
        this.validator = new Validator({ "email": this.rules.email })

        if (!this.validator.validate(post)) {
            return Promise.reject({ Validator: this.validator.getErrors() })
        }
        if(active){
            post.status = User.active();
        }
        return this.one(post)
    }

    /**
    * ----------------------------------------------------------------------------
    * Method to find user by token to recovery password, 
    * and validate token and expires are valid
    * ----------------------------------------------------------------------------
    * @param {string} resetToken the token to find the user to update the password
    * @returns {Promise}
    */
    findByResetToken(resetToken, validateExpires = true){
        this.validator = new Validator({"resetToken": "required"})

        if (!this.validator.validate({ resetToken })) {
            return Promise.reject({ Validator: this.validator.getErrors() })
        }

        return new Promise( (resolve, reject) => {
            this.one(function () {
                this.where({ resetToken })
                if (validateExpires){
                    this.andWhere('resetExpires', '>', Date.now())
                }
            }, [], ['id', 'status', 'name', 'resetToken', 'resetExpires'])
            .then(res => {
                if(!res.status){
                    return reject({ Notfound: { message: "Usuário inativo"} })
                }
                resolve(res)
            })
            .catch(err => reject(typeof err === 'string' ? { Notfound: err } : err))
        })
    }

    /**
    * ----------------------------------------------------------------------------
    * Method to validate of the user exists with the email or username wished
    * ----------------------------------------------------------------------------
    * @returns {Promise}
    */
    uniqueUser() {
        let id = this.id
        let email = this.email
        let username = this.username
        
        return this.one(function () {
            this.whereRaw('(email = ? OR username = ?)', [email, username])

            if (id) {
                this.andWhere('id', '<>', id)
            }
        })
    }

    /**
     * ----------------------------------------------------------------------------
     * Update the reset password token and expires date of the load user
     * ----------------------------------------------------------------------------
     * @param {int} id the id of the user to send token
     * @returns {Promise}
     */
    updateResetToken(id) {
        let { resetToken } = require('../.env')
        
        let bcrypt = require('bcrypt-nodejs')
        let password = bcrypt.hashSync(Date.now() * 1000, bcrypt.genSaltSync(10));
        let token = require('crypto').randomBytes(32).toString('hex');
        let expires = Date.now() + (resetToken || (1 * 60 * 60 * 1000))
        
        return new Promise( (resolve, reject) => {
            this.id = id
            this.update({ password, resetToken: token, resetExpires: expires })
                .then(_ => resolve({ token, expires }))
                .catch(err => reject(err))
        })
    }

    /**
     * ----------------------------------------------------------------------------
     * Update the password of the user by token with recovery password
     * ----------------------------------------------------------------------------
     * @param {object} post the data with password and confirmation
     * @param {string} post.password the password to be update
     * @param {string} post.confirmation the confirmation of the password
     * @param {int} id the id of the user to send token
     * @returns {Promise}
     */
    updatePassword(post, id){
        const bcrypt = require('bcrypt-nodejs')
        
        this.id = id
        this.validator = new Validator({
            "password": this.rules.password,
            "confirmation": this.rules.confirmation,
        })

        if (!this.validator.validate(post)) {
            return Promise.reject({ Validator: this.validator.getErrors() })
        }
        
        return this.update({
            password: bcrypt.hashSync(post.password, bcrypt.genSaltSync(10)),
            resetToken: null, 
            resetExpires: null
        })
    }
}

module.exports = User