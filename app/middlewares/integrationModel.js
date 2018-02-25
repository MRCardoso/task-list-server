let IntegrationApi = require('mongoose').model('IntegrationApi');

/**
 | --------------------------------------------------------------------------------
 | Create a new record in table integratorApi, 
 | to link the main model with the post data coming from other origins
 | --------------------------------------------------------------------------------
 * @param {Object} request the data of request app
 */
exports.add = function(request) {
    return new Promise(function (resolve, reject) {
        let qs = request.query;
        if (qs.PlatformOrigin && qs.PlatformName){
            let instance = new IntegrationApi({
                description: `Criado vai ${qs.PlatformName}, ${qs.PlatformVersion || ''}`,
                platform: (qs.PlatformOrigin || MOBILE),
                created: new Date()
            });
            instance.save((err, link) => {
                if (err) {
                    return reject(err);
                }
                return resolve(link);
            });
        } else {
            return resolve(null);
        }
    });
};

/**
 | --------------------------------------------------------------------------------
 | Set the updated date for a integratorApi of the main model
 | --------------------------------------------------------------------------------
 * @param {Object} request the data of request app
 * @param {Object|null} integrationApi the instance of the integrator to be updated
 */
exports.sync = function (request, integrationApi) {
    return new Promise(function (resolve, reject) {
        let qs = request.query;
        if (integrationApi != null && (qs.PlatformOrigin && qs.PlatformName)) {
            integrationApi.updated = new Date();
            integrationApi.save((err, link) => {
                if (err) {
                    return reject(err);
                }
                return resolve(link);
            });
        } else {
            return resolve(null);
        }
    });
};
/**
 | --------------------------------------------------------------------------------
 | Set the removed date for a integratorApi of the main model
 | --------------------------------------------------------------------------------
 * @param {Object} request the data of request app
 * @param {Object|null} integrationApi the instance of the integrator to be removed
 */
exports.inactivate = function (request, integrationApi) {
    return new Promise(function (resolve, reject) {
        let qs = request.query;
        if (integrationApi != null){
            integrationApi.removed = new Date();
            integrationApi.save((err, link) => {
                if (err) {
                    return reject(err);
                }
                return resolve(link);
            });
        } else {
            return resolve(null);
        }
    });
};

/**
 | --------------------------------------------------------------------------------
 | Update a specific integratorApi of the main model,
 | with the post data coming from other origins
 | --------------------------------------------------------------------------------
 * @param {Object} request the data of request app
 * @param {Object|null} integrationApi the instance of the integrator to be removed
 */
exports.drop = function (request, integrationApi) {
    return new Promise(function (resolve, reject) {
        if (integrationApi == null) {
            return resolve();
        }
        integrationApi.remove(function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    })
};