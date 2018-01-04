var Task = require('mongoose').model('Task'),
    help = require('../helpers'),
    credentials = require('../../config/credentials');

/**
 * Method to list all tasks
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.list = function(req, res)
{
    Task.find(( credentials.isSuperUser(req.user) ? {} : {userId: req.user._id} ))
    .populate('userId', 'name username')
    .exec(function(err, tasks)
    {
        if (err)
        {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        res.json(tasks);
    });
};

/**
 * Method to create a new task
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.create = function(req, res)
{
    let task = new Task(req.body);
    task.platform_origin = WEBPAGE;
    task.userId = req.user;

    task.save(function(err)
    {
        if (err)
        {
            return res.status(400).send({
                message: help.getErrorMessage(err)
            });
        }
        
        res.json({
            output: `A tarefa '${task.title}' foi criada com sucesso`,
            module: task
        });
    })
};

/**
 * Method to update a task loaded in middleware byPk
 * update a task with mongoose method save
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.update = function(req, res)
{
    let task = req.taskData;
    task.setFillables(req.body);
    
    task.save(function(err)
    {
        if (err)
        {
            return res.status(400).send({
                message: help.getErrorMessage(err)
            });
        }
        
        res.json({
            output: `A tarefa '${task.title}' foi atualizada com sucesso`,
            module: task
        });
    });
};

/**
 * Method to delete a task of model User
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.delete = function(req, res)
{
    let task = req.taskData;

    task.remove(function(err)
    {
        if (err)
        {
            return res.status(500).send({ 
                message: help.getErrorMessage(err) 
            });
        }
        
        res.json({
            output: `A tarefa '${task.title}' foi removida com sucesso`,
            module: task
        });
    });
};

/**
 * Method to return the task loaded in middleware byId
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.read = function (req,res)
{
    res.json(req.taskData);
};

/**
 * List all task with the period start or end between the date sent
 * @param {Object} req the object with request information(input)
 * @param {Object} res the object with response information(output)
 */
exports.listToDate = function(req,res)
{
    Task.find({
        "userId": req.user._id,
        // $and: [
        //    {"startDate" : { $lte: date }},
        //    {$or: [{"endData": { $gte: date}}, {"endData": null}]}
        // ]
    }, function (err, tasks)
    {
        if(err)
        {
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        }
        var itens = [], dateFormat = require('dateformat');
        tasks.map(function (task)
        {
            var start = dateFormat(task.startDate,'yyyy-mm-dd'),
                end = dateFormat(task.endDate,'yyyy-mm-dd'),
                post = dateFormat(new Date(req.body.date),'yyyy-mm-dd');

            if( start <= post && (end >= post || end == null ) )
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
exports.hasAuthorization = function(req, res, next)
{
    if (req.taskData.userId.id !== req.user.id)
    {
        if(!credentials.isSuperUser(req.user)){
            return res.status(403).send({
                message: 'Usuário não autorizado!'
            });
        }
    }
    next();
};