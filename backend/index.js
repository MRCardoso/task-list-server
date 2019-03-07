require('./config/globlaConstant')

const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    // .then('./config/passport.js')
    .then('./config/jwt.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(3000, () => {
    console.log(`backend executando ${require('moment')().format('DD/MM/YY HH:mm:ss')}`)
})