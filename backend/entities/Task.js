const { Model } = require('nodeevel')

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
        const fillables = ["id", "userId", "integrationId", "title", "description", "priority", "situation", "status", "startDate", "endDate"]
        const rules = {
            "userId"        : "required|number",
            "integrationId" : "number",
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
            "user": ["users", "userId", ["user.name", "user.email"], false, true],
            "integration": ["integrations_api", "integrationId", ['integration.*'],false, true]
        };
        return relations[alias]
    }

    beforeSave() {
        return new Promise(resolve => {
            this.status = (this.status == "1" || this.status == "true") ? true : false
            resolve()
        })
    }

    /**
    * --------------------------------------------------------------------------------
    * Update integration_api linked with the task id in the request
    * --------------------------------------------------------------------------------
    * @param {int} id the id of the task to be find the api
    * @param {*} trx the instance of transaction
    * @param {object} params the object with params to update the api
    * @param {Date} params.deleted_at the date of the deleting of api
    */
    updateFromApi(id, trx = false, params = {}){
        return new Promise((resolve, reject) => {
            const IntegrationApi = require('./IntegrationApi')
            const integration = new IntegrationApi(this.app)

            this.one(function () {
                this.whereNotNull('integrationId').andWhere({ id })
            })
            .then(t => {
                integration
                .sync({ id: t.integrationId, ...params }, trx)
                .then(resolve)
                .catch(reject)
            })
            .catch(() => resolve(null))
        })
    }
}

module.exports = Task