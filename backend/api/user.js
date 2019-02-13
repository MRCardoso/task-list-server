module.exports = app => {
    const User = require('../entities/User')
    const user = new User(app);

    const all = (req, res) => {
        user.all()
            .then(users => res.json(users))
            .catch(error => res.status(500).send({ message: error }))
    }

    const save = (req,res) => {
        try {
            let data = { ...req.body }
            data.id = (req.params.id ? req.params.id : null)

            user
            .save(data)
            .then(id => res.json({ id }) )
            .catch(error => res.status(400).send({ message: error }))
        } catch (error) {
            res.status(500).send({ message: error })
        }
    }

    const remove = (req, res) => {
        try {
            return user.delete({ id: req.params.id })
                .then(deleted => res.json({deleted}))
                .catch(error => res.status(500).send({ message: error }))
        } catch (error) {
            return res.status(500).send({ message: error });
        }
    }

    const one = (req, res) => {
        try {
            user.one({ id: req.params.id })
                .then(user => res.json(user))
                .catch(error => res.status(500).send({ message: error }))
            
        } catch (error) {
            return res.status(500).send({ message: error  });
        }
    }

    return { all, save, one, remove}
}