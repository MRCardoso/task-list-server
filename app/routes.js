var security = require('./middlewares/mobile.security.js'),
    mobile = require('./controllers/mobile.controller.js'),
    user = require('./controllers/user.controller.js');

module.exports = function (app)
{
    app.get('/', function(req,res){ 
        res.json({message: 'Welcome'}); 
    });
    
    // app.get('/api/users', security.hasAuthorization, user.list);
    // app.post('/api/users/create',security.hasAuthorization, user.create);

    app.post('/api/mobile/syncTask', security.hasAuthorization, mobile.sync);

    app.post('/api/mobile/signin', mobile.signin);
    app.post('/api/mobile/signout', security.loadUserByToken, mobile.signout);
};