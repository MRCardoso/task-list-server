module.exports = app => {
    /**
     * ----------------------------------------------------
     * Auth routes
     * ----------------------------------------------------
     */
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/forgot', app.api.auth.forgot)
    
    app.route('/reset/:token')
        .get(app.api.auth.validateResetToken)
        .post(app.api.auth.reset)
    
    app.route('/signout/:id')
        .get(app.config.jwt.authenticate, app.api.auth.signout)
    
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/refrashToken', app.api.auth.refrashToken)

    /*
    | ------------------------------------------------------------------
    | Mobile requests
    | ------------------------------------------------------------------
    */
    app.post('/mobile/signin', app.api.mobile.signin);
    app.route('/mobile/signout/:id')
        .post(app.config.jwt.authenticate, app.api.mobile.signout);

    app.route('/mobile/tasks')
        .get(app.config.jwt.authenticate, app.api.mobile.tasks)
        .post(app.config.jwt.authenticate, app.api.mobile.sync)

    app.route('/mobile/tasks/:id')
        .put(app.config.jwt.authenticate, app.api.task.hasAuthorization, app.api.mobile.sync)
        .patch(app.config.jwt.authenticate, app.api.task.hasAuthorization, app.api.mobile.inactivate)

    /**
     * ----------------------------------------------------
     * User routes
     * ----------------------------------------------------
     */
    app.route('/users')
        .get(app.config.jwt.authenticate, app.api.auth.isAdmin,app.api.user.all)
        .post(app.config.jwt.authenticate, app.api.auth.isAdmin, app.api.user.save)

    app.route('/users/:id')
        .get(app.config.jwt.authenticate, app.api.user.hasAuthorization, app.api.user.one)
        .put(app.config.jwt.authenticate, app.api.user.hasAuthorization, app.api.user.save)
        .patch(app.config.jwt.authenticate, app.api.user.hasAuthorization, app.api.user.remove)

    app.route('/users/:id/tokens/:apiId')
        .delete(app.config.jwt.authenticate, app.api.auth.isAdmin, app.api.user.removeToken)

    /**
    * ----------------------------------------------------
    * Tasks routes
    * ----------------------------------------------------
    */
    app.route('/tasks')
        .get(app.config.jwt.authenticate, app.api.task.all)
        .post(app.config.jwt.authenticate, app.api.task.save)

    app.route('/tasks/:id')
        .get(app.config.jwt.authenticate, app.api.task.hasAuthorization, app.api.task.one)
        .put(app.config.jwt.authenticate, app.api.task.hasAuthorization, app.api.task.save)
        .delete(app.config.jwt.authenticate, app.api.task.remove)

    app.route('/dailytask/:date').get(app.config.jwt.authenticate, app.api.task.dailyTask)
    app.route('/upload/:userId').post(app.config.jwt.authenticate, app.api.uploader.save)
    app.route('/remove/:userId').post(app.config.jwt.authenticate, app.api.uploader.removeObject)
}