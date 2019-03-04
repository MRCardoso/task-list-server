const Model = require('../modules/Model');

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key the the table
 * @property {int} userId the user foreign of this model
 * @property {string} title the title of this model
 * @property {string} description the description of this model
 * @property {int} priority the priority of this model
 * @property {int} situation the situation of this model
 * @property {bool} status the status of this model
 * @property {Date} startDate the startDate of this model
 * @property {Date} endDate the endDate of this model
 * @property {Date} created_at the date of creation of user
 * @property {Date} updated_at the date of last update of data the user
 */
class Task extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "title", "description", "priority", "situation", "status", "startDate", "endDate"]
        const rules = {
            "userId"        : "required|number",
            "title"         : "required|max:80",
            "priority"      : "required|number",
            "situation"     : "required|number",
            "status"        : "required|number",
            "startDate"     : "date|required",
            "endDate"       : "date",
        }
        super(app, "tasks", rules, fillables)
    }

    relations(alias) {
        let relations = {
            "users": ["users", "id", "userId", ["users.name", "users.email"]]
        };
        return relations[alias]
    }

    beforeSave() {
        return new Promise(resolve => {
            this.status = (this.status == "1" || this.status == "true") ? true : false
            resolve()
        })
    }
}

module.exports = Task