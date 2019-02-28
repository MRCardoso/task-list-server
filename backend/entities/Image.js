const Model = require('../modules/Model');

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

    relations(alias) {
        let relations = {
            "users": ["users", "id", "userId", ["users.name", "users.email"]]
        };
        return relations[alias]
    }
}

module.exports = Image