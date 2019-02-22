const Validator = require('../modules/Validator')
const User = require('./User')

class Auth {
    constructor(mode = 'signin', app){
        let params = {}
        switch (mode) {
            case 'signin':
                params = {
                    "email": "required|email",
                    "password": "required|min:8|max:255",
                }
                break;
        }
        this.validator = new Validator(params)
        this.app = app
    }

    login(post){
        return new Promise((resolve, reject) => {
            if (!this.validator.validate(post)) {
                return reject({ status: 400, message: this.validator.getErrors() })
            }
            
            const user = new User(this.app);
            
            user.one({ email: post.email}, [], true).then(logged => {
                const bcrypt = require('bcrypt-nodejs')
                const isMatch = bcrypt.compareSync(post.password, logged.password)
                if (!isMatch) {
                    return reject({status: 401, message: { password: ["Password invalid"] }})
                }
                resolve(logged)
            }).catch(err => {
                console.log({err})
                return reject({status: 401, message: { email: ["User not found"]}})
            })
        })
    }

}

module.exports = Auth