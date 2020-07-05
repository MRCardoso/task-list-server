require('./config/globlaConstant')

const DB = require('./knexfile') 
const validationLabel = require('./config/validator')
const { Validatorus, server } = require('mcarz-back-utils')

Validatorus.addMessage(validationLabel)

server(DB, 3000, ...[
    './config/passport.js',
    './config/middlewares.js',
    './api',
    './config/routes.js'
])