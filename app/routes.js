var passport = require('passport'),
    index = require('./controllers/index.controller.js'),    
    mobile = require('./controllers/mobile.controller.js'),
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

    app.get('/oauth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/oauth/google/callback', passport.authenticate('google', {failureRedirect: '/signin'}), (req, res) => res.redirect('/'));

    app.get('/oauth/facebook', passport.authenticate('facebook'));
    app.get('/oauth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signin' }), (req, res) => res.redirect('/') );
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

    app.route('/api/users/:userId/tokens/:apiId')
        .delete(iuof.middlewares.requireLogin, security.isSuperUser, user.deleteApi);
    
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
    app.post('/api/mobile/signin', mobile.signin);
    app.post('/api/mobile/signout', iuof.middlewares.requireAuthToken, mobile.signout);
    
    app.route('/api/mobile/tasks')
        .get(iuof.middlewares.requireAuthToken, mobile.list)
        .post(iuof.middlewares.requireAuthToken, task.create);
    
    app.route('/api/mobile/tasks/:taskId')
        .put(iuof.middlewares.requireAuthToken, task.update)
        .patch(iuof.middlewares.requireAuthToken, task.inactivate);
    app.param('taskId', security.byId);
};