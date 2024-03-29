module.exports = app => {
    const { prepareResponse } = require('nodeevel')

    const Task = require('../entities/Task')
    const task = new Task(app)

    const IntegrationApi = require('../entities/IntegrationApi')
    const integration = new IntegrationApi(app)

    /**
    * --------------------------------------------------------------------------------
    * Load all task that was sync with server by device id
    * --------------------------------------------------------------------------------
    * @param {Object} req the data of request app
    * @param {Object} res the data of response app
    */
    const tasks = async (req, res) => {
        let total = 0;
        try {
            let size = await task.count({ userId: req.user.id})
            total = size.total
        } catch (error) { }

        task.all()
            .andWhere({ userId: req.user.id })
            .limit(req.query.limit || 10)
            .offset(parseInt(req.query.offset || 0))
            .then(tasks => {
                var result = tasks
                    .map(r => {
                        return {
                            id_task_reference: r.id,
                            title: r.title,
                            description: r.description,
                            priority: r.priority,
                            situation: r.situation,
                            status: r.status,
                            created: r.created_at,
                            start_date: r.startDate,
                            end_date: r.endDate
                        };
                    });
                return res.json({items: result, total});
            })
            .catch(err => prepareResponse(res, err))
    }

    /**
    * --------------------------------------------------------------------------------
    * Create and update tasks in the application comes from mobile
    * and link the integration with task to knew the task that comes from mobile
    * --------------------------------------------------------------------------------
    * @param {Object} req the data of request app
    * @param {Object} res the data of response app
    */
    const sync = async (req, res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)
        data.userId = req.user.id

        app.db.transaction(function (trx) {
            let promise
            if (data.id) {
                promise = task.updateFromApi(data.id, trx)
            } else {
                promise = integration.add(req.query, PLATFORM_MOBILE, trx)
            }

            promise.then(integrationId => {
                data.integrationId = integrationId
                task.save(data, trx).then(trx.commit).catch(trx.rollback)
            }).catch(trx.rollback)
        })
        .then(id => res.json({ id }))
        .catch(error => prepareResponse(res, error))
    }

    /**
    * --------------------------------------------------------------------------------
    * Method to mark as removed the task, when come from other origin that not web application
    * --------------------------------------------------------------------------------
    * @param {Object} req the object with request information(input)
    * @param {Object} res the object with response information(output)
    */
    const inactivate = (req, res) => {
        task.updateFromApi(req.params.id, false, { deleted_at: new Date()})
            .then(id => res.json({ id }))
            .catch(error => prepareResponse(res, error))
    }

    return { tasks, sync, inactivate }
}