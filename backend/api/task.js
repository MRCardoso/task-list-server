module.exports = app => {
    const { responseErr } = require("../modules/Utils")

    const Task = require('../entities/Task')
    const task = new Task(app)

    const all = (req, res) => {
        let query = task.all(["user"])
        if(!req.user.admin){
            query.where({ userId: req.user.id })
        }
            
        query.then(tasks => res.json(tasks))
            .catch(error => responseErr(res, error))
    }

    const dailyTask = (req, res) => {
        let currentDay = req.params.date || null;
        if (!currentDay){
            return res.status(400).send("Pro favor, fornece uma data")
        }
        task.all()
            .where({ userId: req.user.id, startDate:  currentDay })
            .then(tasks => res.json(tasks))
            .catch(error => responseErr(res, error))
    }

    const save = (req,res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)
        data.userId = req.user.id
        
        task.save(data)
            .then(id => res.json({ id }) )
            .catch(error => responseErr(res, error))
    }

    const remove = (req, res) => {
        task.delete(paramsChanges(req))
            .then(deleted => res.json({deleted}))
            .catch(error => responseErr(res, error))
    }

    const one = (req, res) => {
        task.one(paramsChanges(req), ["user", "integration"])
            .then(task => res.json(task))
            .catch(error => responseErr(res, error, "Tarefa não encontrada"))
    }

    const hasAuthorization = (req, res, next) => {
        if (req.body.userId !== req.user.id) {
            if (!req.user.admin) {
                return res.status(403).send('Usuário não autorizado');
            }
        }
        next()
    }

    const paramsChanges = (request) => {
        let params = { "tasks.id": request.params.id }
        if (!request.user.admin) {
            params["users.id"] = request.user.id
        }
        return params
    }

    return { all, save, one, remove, dailyTask, hasAuthorization}
}