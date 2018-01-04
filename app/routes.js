var passport = require('passport'),
    index = require('./controllers/core/index.controller.js'),    
    mobile = require('./controllers/core/mobile.controller.js'),
    user = require('./controllers/user.controller.js'),
    task = require('./controllers/task.controller.js'),
    security = require('./middlewares/security.js');
    signiuof = require('signiuof');

module.exports = function (app)
{
    let options = Object.assign({}, require('../config/credentials'), {passwdChange:'/api/users/changePassword'});
    let iuof = signiuof.Iuof(options);
    
    iuof.routes(app);
    
    app.get('/', index.render);
    /*
    | ------------------------------------------------------------------
    | User requests
    | ------------------------------------------------------------------
    */
    app.route('/api/users')
        .get(iuof.middlewares.requireLogin, security.isSuperUser, user.list)
        .post(iuof.middlewares.requireLogin, security.isSuperUser, user.create);
        
    app.route('/api/users/:userId')
        .get(iuof.middlewares.requireLogin, security.isSuperUser, user.read)
        .put(iuof.middlewares.requireLogin, security.isSuperUser, user.update)
        .delete(iuof.middlewares.requireLogin, security.isSuperUser, user.delete);
    
    app.route('/api/myData/:userId')
        .get(iuof.middlewares.requireLogin, user.isOwner, user.read)
        .put(iuof.middlewares.requireLogin, user.isOwner, user.update);    
    
    app.param('userId',security.byId);

    /*
    | ------------------------------------------------------------------
    | task requests
    | ------------------------------------------------------------------
    */    
    app.route('/api/tasks')
        .post(iuof.middlewares.requireLogin, task.create)
        .get(iuof.middlewares.requireLogin, task.list);
        
    app.route('/api/tasks/:taskId')
        .get(iuof.middlewares.requireLogin, task.hasAuthorization, task.read)
        .put(iuof.middlewares.requireLogin, task.hasAuthorization, task.update)
        .delete(iuof.middlewares.requireLogin, task.hasAuthorization, task.delete);

    app.param('taskId',security.byId);

    /*
    | ------------------------------------------------------------------
    | Utils
    | ------------------------------------------------------------------
    */
    app.post('/api/upload/:dataId', iuof.middlewares.requireLogin, index.upload);
    app.post('/api/removeObject', index.removeObject);
    app.post('/api/tasks/listToDate', iuof.middlewares.requireLogin, task.listToDate);
    /*
    | ------------------------------------------------------------------
    | Mobile requests
    | ------------------------------------------------------------------
    */
    // app.get('/api/users', iuof.middlewares.requireAuthToken, user.list);
    // app.post('/api/users/create',iuof.middlewares.requireAuthToken, user.create);

    app.post('/api/mobile/syncTask', iuof.middlewares.requireAuthToken, mobile.sync);

    app.post('/api/mobile/signin', mobile.signin);
    app.post('/api/mobile/signout', security.loadUserByToken, mobile.signout);
};