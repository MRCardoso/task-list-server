var credentials = require('../../../config/credentials'),
    fs = require('fs'),
    uploader = require('uploader-go-bucket'),
    s3Helper = uploader.s3Helper({ bucket: credentials.s3Bucket }),
    help = require('../../helpers');

exports.render = function (req,res)
{
    if(req.session.lastVisit)
    {
        console.log("last access: " + (req.session.lastVisit) );
    }
    req.session.lastVisit = new Date();
    req.session.image = null;
    
    res.render('index', {
        title: credentials.appName,
        user: JSON.stringify(req.user),
        isSuperUser: credentials.isSuperUser(req.user),
        S3URL: credentials.s3Url+credentials.s3Bucket,
        s3ImagePath: credentials.s3ImagePath,
        ERR: JSON.stringify(ERR)
    });
};

/**
| ------------------------------------------------------------------------------------
| Method to upload of the image
| init instance of the object formidable end define your path for storage the image
| validate size (max 3MB) and extension('gif','jpg','jpeg', 'png', 'x-png', 'pjpeg')
| success: execute the upload
| error: return a header 400 with the error
| ------------------------------------------------------------------------------------
* @param {Object} req the object with request information(input)
* @param {Object} res the object with response information(output)
*/
exports.upload = function(req, res)
{
    var regex = new RegExp(MIME_TYPES.join("|"), "i");
    
    uploader
    .uploader({
        uploadDir: credentials.uploadPath,
        multiples: false,
    }, req)
    .then(file =>
    {
        var error = [];
        if( !regex.test(file.type) )
            error.push(`<p>Extensão Inválida, Tipo de Arquivo Aceito é: ${MIME_TYPES.join(',')}</p>`);
        if(file.size > MAX_SIZE_UPLOAD)
            error.push("<p>O Tamanho do Arquivo é Maior do que o Limite Aceito de 3MB</p>");
        
        if( error.length > 0 )
        {
            fs.unlink(file.path);
            return res.status(400).send({message: error.join('')});
        }
        var date = new Date(),
            string = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${file.name}`,
            hasString = require('crypto').createHash('md5').update(string).digest('hex')+'.'+file.name.split('.').pop(),
            path = `${credentials.s3ImagePath}/${req.params.dataId}/${hasString}`;
        
        s3Helper
        .uploadObject(file, path, file.path)
        .then(data=>{
            var fileData = {
                "size": file.size,
                "path": hasString,
                "name": file.name,
                "type":file.type,
                "mtime":file.mtime
            };
            req.session.image = fileData;

            res.json({
                original: file, 
                uploaded: fileData,
                data: data, 
                path: path,
            });
        },err=>{
            fs.unlink(file.path);
            return res.status(500).send({
                message: help.getErrorMessage(err)
            });
        });
    }, err => {
        return res.status(400).send({
            message: help.getErrorMessage(err)
        });
    });
};
/**
| ------------------------------------------------------------------------------------
| Method to remove a object of the bucket
| success: return a status 200
| error: return a status 500
| ------------------------------------------------------------------------------------
* @param {Object} req the object with request information(input)
* @param {Object} res the object with response information(output)
*/
exports.removeObject = function(req,res)
{
    let items = [];
    if( req.body.Keys != undefined && req.body.Keys.length>0)
        req.body.Keys.map(item => items.push({Key: item}));    

    s3Helper
    .deleteObject(items)
    .then(data =>
    {
        req.session.image = null;
        res.json({
            message: "Arquivo Removido Com Sucesso!"
        });
    }, err => {
        let defaultMessage = 'Não foi possível remover o arquivo!';
        return res.status(500).send({
            message: (err != null ? (err.message || defaultMessage) : defaultMessage)
        });
    });
};