module.exports = app => {
    const feedback = (req, res) =>{ 
        const { MAIL } = require('../.env')
        const { responseErr, sendMail } = require("../modules/Utils")
        const Validator = require('../modules/Validator')
        const moment = require('moment')
        let validator = new Validator({
            "name": "required|max:250",
            "email": "required|mail|max:120",
            "type": "required",
            "message": "required",
        })

        let post = req.body;
        let authString = ''
        if(req.body.user){
            authString = `{p}{strong}Usuário Logado:{/strong} ${req.body.user.name} (${req.body.user.username}){/p}`
        }

        if (!validator.validate(post)) {
            return res.status(400).send({ validations: validator.getErrors()});
        }

        sendMail({
            mail: MAIL.adminMail,
            title: 'Formulário de Contato',
            subject: "Formulário de Contato",
            content: `
                {div class="list-item"}{strong}Nome:{/strong} ${post.name}{/div}
                {div class="list-item"}{strong}E-mail:{/strong} ${post.email}{/div}
                {div class="list-item"}{strong}Tipo de Feedback:{/strong} ${post.type}{/div}
                {div class="list-item" style="padding: 0 !important;"}${post.message}{/div}
                ${authString}
                {p}
                    {strong}Data da solicitação: {/strong}
                    {i}${moment().format('DD/MM/YY HH:mm:ss')}{/i}
                {/p}
            `
        }, MAIL)
        .then(_ => res.json({ success: "Sucesso" }))
        .catch(err => responseErr(res, err))
    }
    return {feedback}
}