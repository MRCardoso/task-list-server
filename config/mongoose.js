/**
 * option in use of the noSql mongo
 * @option: $lt(<), $lte(<=), $gt(>), $gte(>=), $ne(!=)
 * Model.remove({field: {option: 'value'},{n:n}}, callback())
 * @option: $or(OR), $not(NOT), $and(AND),
 * Model.remove({option:[{field: 'value'},{n:n}]}, callback())
 * @option: $in(IN),$nin(NOT IN)
 * Model.remove({field:{option: ['value','n']}}, callback())
 */
module.exports = function () {
    let signiuof = require('signiuof');
    signiuof.Iuof().connectMongo(require('./env/'+process.env.NODE_ENV+'.js'), function(db){
        require('../app/models/task.js');
        require('../app/models/integrationApi.js');
        return db;
    })
};
