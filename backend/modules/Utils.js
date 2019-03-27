exports.generateFileString = name => {
    let hasName = require('crypto').createHash('md5').update(`${Date.now()}-${name}`).digest('hex')
    let ext = name.split('.').pop()
    return `${hasName}.${ext}`
}

exports.datesExpires = (expires, def = 60) => {
    let now = Math.floor(Date.now()/1000)
    return { now, expires: (now + (expires || def))}
}

exports.createTokenPayload = (logged, platform) => {
    let { authSecret, authToken } = require('../.env')
    let { now, expires } = exports.datesExpires(authToken)
    let jwt = require('jwt-simple')

    let payload = {
        id: logged.id,
        platform,
        iat: now,
        exp: expires
    }
    let token = jwt.encode(payload, authSecret)

    return { token, expires, payload }
}

exports.prepareError = error => {
    let reason = {}
    switch (typeof error) {
        case "object":
            if (error.sqlMessage && error.sql) {
                reason = { status: 500, err: "Código #0001 não foi possível persistir dados" }
            } else if (error.message && error.stack) {
                reason = { status: 500, err: "Código #0002 não foi possível processar sua ação" }
            } else if (error.Validator) {
                reason = { status: 400, err: { validations: error.Validator } }
            } else if (error.Unauthorized) {
                reason = { status: 401, err: error.Unauthorized }
            } else if (error.Forbbiden) {
                reason = { status: 403, err: error.Forbbiden }
            } else if (error.Notfound) {
                reason = { status: 404, err: error.Notfound }
            } else{
                reason = { status: 500, err: "Código #0004 erro desconhecido" }
            }
            break
        case "string": 
            reason = { status: 400, err: error }
            break
        default:
            reason = { status: 500, err: "Código #0005 desconhecido" }
            break
    }
    if(reason.status!=400){
        if(reason.status==500){
            exports.writeLog(error)
        }
        console.log('\x1b[31m', error, '\x1b[0m')
    }
    return reason
}

exports.responseErr = (response, error, defError = null) => {
    let { status, err } = exports.prepareError(error)
    if (typeof err === "string"){
        err = { message: (defError || err)}
    }
    return response.status(status).send(err)
}

exports.sendMail = (data, credentials) => {
    function replaceCharacters(html, content, title) {
        while (content.indexOf("{") != -1 || content.indexOf("}") != -1) {
            content = content.replace(/\{/ig, '<').replace(/\}/ig, '>');
        }
        const { AWS, logoHeader, logoFooter } = require('../.env')
        
        
        return html
            .replace("{title}", title)
            .replace("{logo1}", (logoHeader ? `<img src="${AWS.URL}${AWS.Bucket}/${logoHeader}" width="40">` : ''))
            .replace("{logo2}", (logoFooter ? `<img src="${AWS.URL}${AWS.Bucket}/${logoFooter}" width="80">` : ''))
            .replace("{content}", content);
    }
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject("Não há conteúdo para envio do email")
        }
        
        if (!credentials.serviceMail || !credentials.loginMail || !credentials.passMail) {
            return reject("Por favor configure o servidor de email, login e senha!")
        }

        let path = credentials.rPath || 'mail';
        let view = credentials.view || 'index';
        let ext = credentials.ext || 'html';
        let filenamePath = `./${path}/${view}.${ext}`;
        
        console.log(`send-file: ${filenamePath}`);
        require('fs').readFile(filenamePath, 'utf8', (err, template) => {
            if (err) {
                return reject(err);
            }

            console.log('sending-mail');

            let nodemailer = require('nodemailer')
            let transporte = nodemailer.createTransport({
                service: credentials.serviceMail,
                auth: {
                    user: credentials.loginMail,
                    pass: credentials.passMail
                }
            })
            let email = {
                from: ['Task-List App', " <", credentials.loginMail, ">"].join(''),
                to: data.mail,
                subject: data.subject,
                headers: { 'content-type': 'text/html' },
                html: replaceCharacters(template, data.content, data.title)
            }

            if ('annex' in data) {
                if ('name' in data.annex && 'path' in data.annex)
                    email.attachments = [{ filename: data.annex.name, path: data.annex.path }];
            }
            transporte.sendMail(email, (err, info) => (err ? reject(err) : resolve(info)));
        });
    })
}

exports.writeLog = (message) => {
    let fs = require('fs')
    let date = new Date()
    let pathLog = `.tls-logs/`
    let fileName = `${require('moment')().format('YYYY-MM-DD')}.log`;
    message = `================START - ${date}\n${JSON.stringify(message)}\n================END - ${date}\n`;

    if (!fs.existsSync(pathLog)) {
        fs.mkdirSync(pathLog);
    }
    fs.writeFile(`${pathLog}/${fileName}`, message, { 'flag': 'a' }, (err, d) => {
        console.log(err ? { "LOG-ERR:": err } : { "LOG-SUCCESS:": d })
    });
}