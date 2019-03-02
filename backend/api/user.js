module.exports = app => {
    const { responseErr } = require("../modules/Utils")
    
    const User = require('../entities/User')
    const user = new User(app)

    const Image = require('../entities/Image')
    const image = new Image(app)

    const all = (req, res) => {
        user.all()
            .orderBy('id', 'desc')
            .then(users => res.json(users))
            .catch(error => responseErr(res, error))
    }

    const save = (req,res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)
        data.admin = (req.user && req.user.admin ? (req.body.admin  || false) : false)

        user
        .save(data)
        .then(id => res.json({ id }) )
        .catch(error => responseErr(res, error))
    }

    const remove = (req, res) => {
        return user.delete({ id: req.params.id })
            .then(deleted => res.json({deleted}))
            .catch(error => responseErr(res, error))
    }

    const one = (req, res) => {
        user.one({ "users.id": req.params.id })
            .then(user => {
                image.imagesByUser(user.id).then(images => {
                    user.images = images
                    res.json(user)
                })
            })
            .catch(error => responseErr(res,{ Notfound: error}, "Usuário não encontrado"))
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