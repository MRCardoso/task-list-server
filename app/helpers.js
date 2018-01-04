var credentials = require('../config/credentials'),
    fs = require('fs');

/**
 * return error use the obj err of the mongoose
 * @param err
 * @param nobr
 * @returns {string}
 */
exports.getErrorMessage = function(err, noTags = true, isString = true)
{
    var message = [];
    if( err == null || err == 'undefined')
        return "erro inesperado aconteceu!";
    if( typeof err == 'string'){
        return err;
    }
    if('code' in err)
    {        
        switch (err.code)
        {
            case 11000:
            case 11001:
                message.push('Usuário já existe');
                break;
            default:                
                message.push('Erro desconhecido!');
        }
        this.writeLogs(JSON.stringify(err, null, 4));
    }
    else
    {
        if ('errors' in err)
        {
            for(var errName in err.errors)
            {                
                if(err.errors[errName].message)
                {
                    message.push(err.errors[errName].message);
                }
            }
        }
        else
        {
            this.writeLogs(JSON.stringify(err, null, 4));
            message.push('server error internal!');
        }
    }
    if( isString )
        return message.join(noTags?'<br>':'');
    else
        return message;
};

/**
| --------------------------------------------------------------------------------
| Create a hash string with base in the password send
| --------------------------------------------------------------------------------
* @param {string} password the string to be convert to hash
* @param {function} next the callback function called when success and fail
*/
exports.hashing = function(password, next)
{
    if( password==null || password==undefined || password==''){
        return next('The password is required',null);
    }
    var bcrypt = require('bcrypt-nodejs');
    
    bcrypt.genSalt(5, (err, salt) =>{
        if (err){
            return next(err,null);
        }
        
        bcrypt.hash(password, salt, null, (err, hash) =>{
            if (err){
                return next(err,null);
            }
            return next(false, hash);
        });
    });
};

exports.replaceCharacters = function (html, content, title)
{
    while( content.indexOf("{") != -1 || content.indexOf("}") != -1 )
    {
        content = content.replace(/\{/ig, '<').replace(/\}/ig,'>');
    }
    return html.replace("{title}",title)
               .replace("{content}",content);
};

exports.writeLogs = function(message)
{
    let dateFormat = require('dateformat');
    let date = new Date();
    let pathLog = '.tls-logs';
    let fileName = `${dateFormat(date,'yyyy-mm-dd')}.log`;
    message = `================START - ${date}\n${message}\n================END - ${date}\n`;

    if( !fs.existsSync(pathLog) ){
        fs.mkdir(pathLog);
    }
    fs.writeFile(`${pathLog}/${fileName}`, message, {'flag':'a'}, (err,d) => {  
        if (err){
            console.log('LOG-ERR:', err);
        }
        console.log('LOG-SUCCESS:', d);
    });
}