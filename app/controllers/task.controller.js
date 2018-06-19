var Task = require('mongoose').model('Task'),
    IntegrationApi = require('mongoose').model('IntegrationApi'),
    integrationModel = require('../middlewares/integrationModel'),
    help = require('../helpers'),
    credentials = require('../../config/credentials');

/**
 | --------------------------------------------------------------------------------
 | Method to list all tasks
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.list = function (req, res) {
    Task.find((credentials.isSuperUser(req.user) ? {} : { userId: req.user._id }))
        .populate('userId', 'name username')
        .populate('integrationApiId', '_id platform description created removed updated')
        .exec(function (err, tasks) {
            if (err) {
                return res.status(500).send({
                    message: help.getErrorMessage(err)
                });
            }
            var result = tasks.filter(r => {
                return (r.integrationApiId != null && r.integrationApiId.platform == MOBILE);
            })
            res.json(tasks);
        });
};

/**
 | --------------------------------------------------------------------------------
 | Method to create a new task
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.create = function (req, res) {
    let task = new Task(req.body);
    integrationModel.add(req).then(function (link) {
        task.userId = req.user;
        task.integrationApiId = link;
        task.save(function (err) {
            if (err) {
                return res.status(400).send({ message: help.getErrorMessage(err) });
            }

            templateNotification(task, 'C', req);

            res.json({
                output: `A tarefa '${task.title}' foi criada com sucesso`,
                module: task
            });
        });
    }, err1 => {
        return res.status(400).send({ message: help.getErrorMessage(err1) });
    });
};

/**
 | --------------------------------------------------------------------------------
 | Method to update a task loaded in middleware byPk, update a task with mongoose method save
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.update = function (req, res)
{
    let task = req.taskData;
    task.setFillables(req.body);
    integrationModel.sync(req,task.integrationApiId).then(function () {
        task.save(function (err) {
            if (err) {
                return res.status(400).send({ message: help.getErrorMessage(err) });
            }

            templateNotification(task, 'U', req);

            res.json({
                output: `A tarefa '${task.title}' foi atualizada com sucesso`,
                module: task
            });
        });
    }, err1 => {
        res.status(400).send({ message: help.getErrorMessage(err1) });
    });
};

/**
 | --------------------------------------------------------------------------------
 | Method to delete a task of model User
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.delete = function (req, res) {
    let task = req.taskData;
    integrationModel.drop(req, task.integrationApiId).then(function () {
        task.remove(function (err) {
            if (err) {
                return res.status(500).send({ message: help.getErrorMessage(err) });
            }

            templateNotification(task, 'D', req);

            res.json({
                output: `A tarefa '${task.title}' foi removida com sucesso`,
                module: task
            });
        });
    }, err1 => {
        return res.status(500).send({ message: help.getErrorMessage(err1) });
    });
};

/**
 | --------------------------------------------------------------------------------
 | Method to mark as removed the task, when come from other origin that not web application
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.inactivate = function (req, res) {
    var task = req.taskData;
    integrationModel.inactivate(req, task.integrationApiId).then(function () {
        templateNotification(task, 'I', req);
        res.json({ task: task });
    }, err1 => {
        return res.status(500).send({ message: help.getErrorMessage(err1) });
    });
}

/**
 | --------------------------------------------------------------------------------
 | Method to return the task loaded in middleware byId
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.read = function (req, res) {
    res.json(req.taskData);
};

/**
 | --------------------------------------------------------------------------------
 | List all task with the period start or end between the date sent
 | --------------------------------------------------------------------------------
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.listToDate = function (req, res) {
    Task.find({ "userId": req.user._id }, function (err, tasks) {
        if (err) {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        var itens = [], dateFormat = require('dateformat');
        tasks.map(function (task) {
            var start = dateFormat(task.startDate, 'yyyy-mm-dd'),
                end = dateFormat(task.endDate, 'yyyy-mm-dd'),
                post = dateFormat(new Date(req.body.date), 'yyyy-mm-dd');

            if (start <= post && (end >= post || end == null))
                itens.push(task);
        });
        res.json(itens);
    });
};

/**
 * Middleware to verify the authorization to save the task
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 * @param {*} next 
 * @returns {*}
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.taskData.userId.id !== req.user.id) {
        if (!credentials.isSuperUser(req.user)) {
            return res.status(403).send({
                message: 'Usuário não autorizado!'
            });
        }
    }
    next();
};

/**
 * Method to create call of the notification
 * @param {Object} t task object
 * @param {Object} req the object with request information(input)
 * @param {*} next 
 * @returns {*}
 */
function templateNotification(t, action, request) {
    switch (action) {
        case 'C': action = 'criada'; break;
        case 'U': action = 'atualizada'; break;
        case 'D': action = 'removida'; break;
        case 'I': action = 'inativada'; break;
    }
    help.notify({
        title: `Tarefa ${action}`,
        message: `A tarefa '${t.title}' foi ${action} com sucesso`,
        url: `tasks/${t.id}/view`
    }, request);
}