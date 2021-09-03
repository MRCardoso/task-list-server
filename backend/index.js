require('./config/globlaConstant')

const DB = require('./knexfile') 
const validationLabel = require('./config/validator')
const { Validator, server } = require('nodeevel')

Validator.addMessage(validationLabel)

server(DB, 3000, ...[
    './config/passport.js',
    './config/middlewares.js',
    './api',
    './config/routes.js'
])