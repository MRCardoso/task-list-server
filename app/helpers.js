/**
 * return error use the obj err of the mongoose
 * @param err
 * @param nobr
 * @returns {string}
 */
exports.getErrorMessage = function(err, noTags)
{
    var message = '';
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
                message = 'User already exists';
                break;
            default:                
                message = 'Erro desconhecido!';
        }
    }
    else
    {
        if ('errors' in err)
        {
            for(var errName in err.errors)
            {
                if(err.errors[errName].message)
                {
                    let msgs = [err.errors[errName].message]; 
                    if(noTags != true) msgs.push("\n");
                    message += msgs.join('<br>');
                }
            }
        }
        else
        {
            message = 'server error internal!';
        }
    }
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