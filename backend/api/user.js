module.exports = app => {
    const User = require('../entities/User')
    const user = new User(app)

    const Image = require('../entities/Image')
    const image = new Image(app)

    const all = (req, res) => {
        user.all()
            .orderBy('id', 'desc')
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
        user.one({ "users.id": req.params.id })
            .then(user => {
                let { AWS } = require('../.env')
                
                image.all()
                .where({userId: user.id})
                .then( images => {
                    user.images = []
                    images.forEach(i => {
                        user.images.push({
                            id: i.id,
                            userId: i.userId,
                            name: i.name,
                            url: `${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}/${user.id}/${i.name}`
                        })
                    })
                    res.json(user)
                })
                .catch(error => res.status(500).send(error))
            })
            .catch(error => res.status(404).send(error))
    }

    const hasAuthorization = (req, res, next) => {
        if (req.params.id !== req.user.id) {
            if (!req.user.admin) {
                return res.status(403).send('Usuário não autorizado');
            }
        }
        next()
    }

    return { all, save, one, remove, hasAuthorization}
}