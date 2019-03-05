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
        .all(app.config.passport.authenticate())
        .get(app.api.auth.signout)
    
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/refrashToken', app.api.auth.refrashToken)

    /*
    | ------------------------------------------------------------------
    | Mobile requests
    | ------------------------------------------------------------------
    */
    app.post('/mobile/signin', app.api.mobile.signin);
    app.route('/mobile/signout/:id')
        .all(app.config.passport.authenticate())
        .post(app.api.mobile.signout);

    app.route('/mobile/tasks')
        .all(app.config.passport.authenticate())
        .get(app.api.mobile.tasks)
        .post(app.api.mobile.sync)

    app.route('/mobile/tasks/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.task.hasAuthorization, app.api.mobile.sync)
        .patch(app.api.task.hasAuthorization, app.api.mobile.inactivate)

    /**
     * ----------------------------------------------------
     * User routes
     * ----------------------------------------------------
     */
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.auth.isAdmin,app.api.user.all)
        .post(app.api.auth.isAdmin, app.api.user.save)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.hasAuthorization, app.api.user.one)
        .put(app.api.user.hasAuthorization, app.api.user.save)
        .patch(app.api.user.hasAuthorization, app.api.user.remove)

    app.route('/users/:id/tokens/:apiId')
        .all(app.config.passport.authenticate())
        .delete(app.api.auth.isAdmin, app.api.user.removeToken)

    /**
    * ----------------------------------------------------
    * Tasks routes
    * ----------------------------------------------------
    */
    app.route('/tasks')
        .all(app.config.passport.authenticate())
        .get(app.api.task.all)
        .post(app.api.task.save)

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.task.hasAuthorization, app.api.task.one)
        .put(app.api.task.hasAuthorization, app.api.task.save)
        .delete(app.api.task.remove)

    app.route('/dailytask/:date').all(app.config.passport.authenticate()).get(app.api.task.dailyTask)
    app.route('/upload/:userId').all(app.config.passport.authenticate()).post(app.api.uploader.save)
    app.route('/remove/:userId').all(app.config.passport.authenticate()).post(app.api.uploader.removeObject)
}