module.exports = app => {
    const Task = require('../entities/Task')
    const task = new Task(app);

    const all = (req, res) => {
        task.all(['users'])
            .then(tasks => res.json(tasks))
            .catch(error => res.status(500).send({ message: error }))
    }

    const save = (req,res) => {
        try {
            let data = { ...req.body }
            data.id = (req.params.id ? req.params.id : null)
            task.userId = req.user.id
            task
            .save(data)
            .then(id => res.json({ id }) )
            .catch(error => res.status(400).send({ message: error }))
        } catch (error) {
            res.status(500).send({ message: error })
        }
    }

    const remove = (req, res) => {
        try {
            return task.delete({ id: req.params.id })
                .then(deleted => res.json({deleted}))
                .catch(error => res.status(500).send({ message: error }))
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }

    const one = (req, res) => {
        try {
            task.one({ "tasks.id": req.params.id }, ["users"])
                .then(task => res.json(task))
                .catch(error => res.status(500).send({ message: error }))
            
        } catch (error) {
            return res.status(500).send({ message: error  });
        }
    }

    return { all, save, one, remove}
}