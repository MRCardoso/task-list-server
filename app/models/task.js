var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let fillables = [
    "title",
    "description",
    "startDate",
    "endDate",
    "status",
    "situation",
    "priority",
];
/**
 * Create Schema of the table 'Task'
 */
var TaskSchema = new Schema({
    title: {
        type: String,
        default: "",
        trim: true,
        required: "O campo titulo é obrigatório!"
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    priority: {
        type: Number,
        required: "O campo prioridade é obrigatório!",
        default: 1 // 1 - low | 2 - average | 3 high
    },
    situation: {
        type: Number,
        required: "O campo situação é obrigatório!",
        default: 1 // 1 - open | 2 - concluded | 3 canceled | 4 in process | 5 expired
    },
    status: {
        type: Boolean,
        required: "O campo status é obrigatório!",
        default: true // 1 - active | 0 - inactive
    },
    startDate: {
        type: Date,
        required: "O campo data inicial é obrigatório!",
    },
    endDate: {
        type: Date,
        default: null
    },
    integrationApiId: {
        type: Schema.ObjectId,
        ref: 'IntegrationApi',
        default: null
    },
    userId: {
        type: Schema.ObjectId,
        required: "O usuário é obrigatório!",
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/** 
| ---------------------------------------------------------------
| Fill the fields of the model
| ---------------------------------------------------------------
* @param {Object} post
*/
TaskSchema.methods.setFillables = function(post) {
    fillables.map(item => this[item] = post[item] );
};

mongoose.model('Task',TaskSchema);