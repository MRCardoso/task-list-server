const { Model } = require('mcarz-back-utils')

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key the the table
 * @property {string} description the name of this model
 * @property {int} platform the platform of this model (1 - mobile, 2 third part)
 * @property {Date} deleted_at the date of the inactivate the user
 */
class IntegrationApi extends Model {
    constructor(app) {
        const fillables = ["id", "description", "platform", "deleted_at"]
        super(app, "integrations_api", {}, fillables)
    }

    /**
    * --------------------------------------------------------------------------------
    * Create a new record in table integratorApi, 
    * to link the main model with the post data coming from other origins
    * --------------------------------------------------------------------------------
    * @param {Object} query the query of the request
    * @param {string} query.PlatformName the name of the origin
    * @param {string} query.PlatformVersion the version of the origin
    * @param {int} platform the platform origin
    * @param {*} trx the instance of transaction
    */
    add(query, platform, trx = false) {
        return new Promise((resolve, reject) => {
            if (!query.PlatformName){
                return reject("Não foi encontrado a plataforma origem desta API")  
            }
            this.save({
                description: `Criado vai ${query.PlatformName}, ${query.PlatformVersion || 0}`,
                platform: platform,
            }, trx)
            .then(id => resolve(id))
            .catch(err => reject(err))
        })
    }

    /**
    * --------------------------------------------------------------------------------
    * Set the updated date for a integratorApi of the main model
    * --------------------------------------------------------------------------------
    * @param {object} params the object with params to update the api
    * @param {int} params.id the id of the api to update
    * @param {Date} params.deleted_at the date of the deleting of api
    * @param {*} trx the instance of transaction
    */
    sync(params, trx = false){
        this.transaction = trx
        this.id = params.id
        return this.update(params)
    }
}

module.exports = IntegrationApi