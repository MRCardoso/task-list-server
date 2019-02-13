module.exports = app => {
    /**
     * ----------------------------------------------------
     * Auth routes
     * ----------------------------------------------------
     */
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    // app.post('/validateToken', app.api.auth.validateToken)

    /**
     * ----------------------------------------------------
     * User routes
     * ----------------------------------------------------
     */
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.user.all)
        .post(app.api.user.save)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.user.one)
        .put(app.api.user.save)
        .delete(app.api.user.remove)

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
        .get(app.api.task.one)
        .put(app.api.task.save)
        .delete(app.api.task.remove)
}