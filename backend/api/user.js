module.exports = app => {
    const User = require('../entities/User')
    const user = new User(app);

    const all = (req, res) => {
        user.all()
            .then(users => res.json(users))
            .catch(error => res.status(500).send(error))
    }

    const save = (req,res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)

        user
        .save(data)
        .then(id => res.json({ id }) )
        .catch(error => res.status(400).send({ validations: error }))
    }

    const remove = (req, res) => {
        return user.delete({ id: req.params.id })
            .then(deleted => res.json({deleted}))
            .catch(error => res.status(500).send(error))
    }

    const one = (req, res) => {
        user.one({ id: req.params.id })
            .then(user => res.json(user))
            .catch(error => res.status(404).send(error))
    }

    return { all, save, one, remove}
}