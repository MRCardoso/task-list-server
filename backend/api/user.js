module.exports = app => {
    const { prepareResponse } = require('nodeevel')
    
    const User = require('../entities/User')
    const user = new User(app)

    const all = (req, res) => {
        user.all()
            .orderBy('id', 'desc')
            .then(users => res.json(users))
            .catch(error => prepareResponse(res, error))
    }

    const save = (req,res) => {
        let data = { ...req.body }
        data.id = (req.params.id ? req.params.id : null)
        data.admin = (req.user && req.user.admin ? (req.body.admin  || false) : false)

        user
        .save(data)
        .then(id => res.json({ id }) )
        .catch(error => prepareResponse(res, error))
    }

    const remove = (req, res) => {
        return user.update({ id: req.params.id, deleted_at: new Date() })
            .then(deleted => res.json({deleted}))
            .catch(error => prepareResponse(res, error))
    }

    const removeToken = (req, res) => {
        const Api = require('../entities/UserApi')
        const api = new Api(app)

        return api.delete({ id: req.params.apiId, userId: req.params.id })
            .then(deleted => res.json({ deleted }))
            .catch(error => prepareResponse(res, error))
    }

    const one = (req, res) => {
        user.one({ "users.id": req.params.id }, ["image", "apis"])
            .then(user => res.json(user))
            .catch(error => prepareResponse(res, error, "Usuário não encontrado"))
    }

    const hasAuthorization = (req, res, next) => {
        if (req.params.id != req.user.id) {
            if (!req.user.admin) {
                return res.status(403).send('Usuário não autorizado');
            }
        }
        next()
    }

    return { all, save, one, remove, removeToken, hasAuthorization}
}