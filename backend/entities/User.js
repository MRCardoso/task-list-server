const { UserEntity } = require('nodeevel')

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
class User extends UserEntity {
    relations(alias) {
        let { AWS } = require('../.env')
        
        let relations = {
            "image": [
                "images", //FK table
                "userId", // FK column
                [ // fk fields
                    "id", "userId", "name", 
                    this.app.db.raw(`CONCAT("https://${AWS.Bucket}.${AWS.URL}/${AWS.uploadFolder}", "/", userId, "/",name) as url`)
                ]
            ],
            "apis": ["users_api", "userId", "*", true]
        };
        return relations[alias]
    }
}

module.exports = User