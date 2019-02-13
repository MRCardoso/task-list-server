const Model = require('../modules/Model');

class User extends Model {
    constructor(app){
        const fillables = ["id", "name", "username", "email", "status"]
        const hiddens = ["password"]
        const rules = {
            "name"          : "required",
            "username"      : "required",
            "email"         : "required|email",
            "password"      : "required|min:8|max:255|compare:confirmation",
            "confirmation"  : "required|min:8|max:255",
            "status"        : "number"
        }
        super(app, "users", rules, fillables, hiddens)
    }

    beforeSave() {
        return new Promise((resolve, reject) => {
            const bcrypt = require('bcrypt-nodejs')
            const salt = bcrypt.genSaltSync(10)
            
            this.password = bcrypt.hashSync(this.password, salt)
            this.status = (this.status == "1" || this.status == "true") ? true : false
            this.attributes["status"] = this.status
            this.attributes["password"] = this.password
            
            this.uniqueUser().then(res => {
                if (res){
                    return reject({ 
                        "custom": this.validator.processMessages("unique", { field: "username/email" }) 
                    });
                }
                resolve();
            }, (custom) => {
                reject({ custom })
            })
        })
    }

    findByEmail(email){
        return this.one({ email: email })
    }

    /**
    | ----------------------------------------------------------------------------
    | Validator if the $attribute already exists in the $table
    | ----------------------------------------------------------------------------
    * @param string attribute the attribute validated
    * @param string table the table reference
    * @return bool
    */
    uniqueUser() {
        let email = this.email
        let username = this.username

        let query = this.app.db('users')
            .select(['id'])
            .where(function () {
                this.where('email', email).orWhere('username', username)
            })
        
        if (this.id) {
            query.andWhere('id', '<>', this.id)
        }

        return query.first()
    }
}

module.exports = User