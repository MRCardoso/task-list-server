const Model = require('../modules/Model');

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
            if (this.startDate){
                let arrayDate = this.startDate.split("/")
                this.startDate = `${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`
            }
            
            if (this.endDate){
                let arrayEnd = this.endDate.split("/")
                this.endDate = `${arrayEnd[2]}-${arrayEnd[1]}-${arrayEnd[0]}`
            }
            resolve()
        })
    }
}

module.exports = Task