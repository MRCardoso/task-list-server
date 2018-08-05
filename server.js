process.env.NODE_ENV = (process.env.NODE_ENV || 'development');
var port = process.env.PORT || 5000,
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    db = mongoose(),
    pp = require('./config/passport'),
    passport = pp(),
    app = express();
app.listen(port);

module.exports = app;

console.info(`Servidor executando em http://localhost:${port}/`);