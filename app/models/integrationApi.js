var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let fillables = [
    "description",
    "platform",
];
/**
 * Create Schema of the table 'IntegrationApi'
 * responsable for the integration of the models of the web app
 * with coming data from other origin, like app mobile
 */
var IntegrationApiSchema = new Schema({
    description: {
        type: String,
        default: "",
        trim: true
    },
    platform: {
        type: Number, // 1 - mobile, 2 - third party
        default: 1,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: null
    },
    removed: {
        type: Date,
        default: null
    }
});

/** 
| ---------------------------------------------------------------
| Fill the fields of the model
| ---------------------------------------------------------------
* @param {Object} post
*/
IntegrationApiSchema.methods.setFillables = function(post) {
    fillables.map(item => this[item] = post[item] );
};

mongoose.model('IntegrationApi',IntegrationApiSchema);