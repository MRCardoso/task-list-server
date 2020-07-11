const { Model } = require('mcarz-back-utils')

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key the the table
 * @property {int} userId the user foreign of this model
 * @property {string} name the name of this model
 */
class Image extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "name"]
        const rules = {
            "userId"        : "required|number",
            "name"          : "required|max:250"
        }
        super(app, "images", rules, fillables)
        this.timestamps = false
    }

    static imageAsObject(i){
        let { AWS } = require('../.env')
        return {
            ...i,
            url: `https://${AWS.Bucket}.${AWS.URL}/${AWS.uploadFolder}/${i.userId}/${i.name}`
        }
    }
}

module.exports = Image