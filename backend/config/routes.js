module.exports = app => {
    app.get('/', (_,res) => res.send('Back-end working...'))
    /**
     * ----------------------------------------------------
     * Auth routes
     * ----------------------------------------------------
     */
    /* Request to create a new user */
    app.post('/api/signup', app.api.user.save)
    /* Request to make login JWT from app by web and mobile */
    app.post('/api/signin', app.api.auth.signin)
    /* Request to make logout JWT from app by web and mobile */
    app.get('/api/signout/:id/:apiId', app.api.auth.signout)
    /* Request to send email to user with link to recovery password */
    app.post('/api/forgot', app.api.auth.forgot)
    /* Request to reset password with token generated in forgot route */
    app.patch('/api/reset/:token', app.api.auth.reset)
    /* Request to validate the token for logged user */
    app.post('/api/validateToken', app.api.auth.validateToken)
    /* request to redo login */
    app.post('/api/refrashToken', app.api.auth.refrashToken)
    app.post('/api/feedback', app.api.help.feedback)

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

    /*
    | ------------------------------------------------------------------
    | Mobile requests
    | ------------------------------------------------------------------
    */
    app.route('/mobile/tasks')
        .all(app.config.passport.authenticate())
        .get(app.api.mobile.tasks)
        .post(app.api.mobile.sync)

    app.route('/mobile/tasks/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.task.hasAuthorization, app.api.mobile.sync)
        .patch(app.api.task.hasAuthorization, app.api.mobile.inactivate)
}