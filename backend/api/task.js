module.exports = app => {
    const Task = require('../entities/Task')
    const task = new Task(app);

    const all = (req, res) => {
        task.all(['users'])
            .where({userId: req.user.id})
            .then(tasks => res.json(tasks))
            .catch(error => res.status(500).send(error))
    }

    const dailyTask = (req, res) => {
        let currentDay = req.params.date || null;
        if (!currentDay){
            return res.status(400).send("Pro favor, fornece uma data")
        }
        task.all(['users'])
            .where({ userId: req.user.id, startDate:  currentDay })
            .then(tasks => res.json(tasks))
            .catch(error => res.status(500).send(error))
    }

    const save = (req,res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)
        data.userId = req.user.id
        
        task.save(data)
            .then(id => res.json({ id }) )
            .catch(error => res.status(400).send({ validations: error }))
    }

    const remove = (req, res) => {
        task.delete({ id: req.params.id })
            .then(deleted => res.json({deleted}))
            .catch(error => res.status(500).send(error))
    }

    const one = (req, res) => {
        task.one({ "tasks.id": req.params.id }, ["users"])
            .then(task => res.json(task))
            .catch(error => res.status(500).send(error))
    }

    const hasAuthorization = (req, res, next) => {
        if (req.body.userId !== req.user.id) {
            if (!req.user.admin) {
                return res.status(403).send('Usuário não autorizado');
            }
        }
        next()
    }

    return { all, save, one, remove, dailyTask, hasAuthorization}
}