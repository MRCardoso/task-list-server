module.exports = app => {
    let uploader = require('uploader-go-bucket')
    let { AWS } = require('../.env')
    let { responseErr } = require("../modules/Utils")

    let Image = require('../entities/Image')
    let image = new Image(app);
    /**
     * ------------------------------------------------------------
     * Upload image from local and s3, and create record em image table
     * ------------------------------------------------------------
     */
    const save = (req, res) => {
        let userId = req.params.userId
        uploadFile(req).then(file => {
            sendToBucket(file, userId).then(imageData => {
                image.save({name: imageData.hashString, userId})
                    .then(id => res.json(Image.imageAsObject({ id, userId, name: imageData.hashString })))
                    .catch(error => responseErr(res, error))
            }, err => responseErr(res, err))
        }, err => responseErr(res, err))
    }

    const removeObject = function (req, res) {
        let items = {id: [], Keys: []}
        if (req.body.Keys != undefined && req.body.Keys.length > 0){
            req.body.Keys.forEach(e => {
                items.id.push(e.id)
                items.Keys.push({ Key: `${AWS.uploadFolder}/${e.userId}/${e.name}` })
            })
        }
        
        uploader
            .s3Helper(AWS)
            .deleteObject(items.Keys)
            .then(data => {
                return image.delete(['id', items.id], 'whereIn')
                    .then(deleted => res.json({ message: "Arquivo Removido Com Sucesso!" }))
                    .catch(error => responseErr(res, error))
            }, err => {
                let defaultMessage = 'Não foi possível remover o arquivo!'
                return res.status(500).send((err != null ? (err.message || defaultMessage) : defaultMessage))
            })
    }

    /**
     * ---------------------------------------------------------------------------
     * Upload a image from local disc
     * ---------------------------------------------------------------------------
     */
    const uploadFile = (request) => {
        let regex = new RegExp(MIME_TYPES.join("|"), "i");
        let fs = require('fs')
        
        return new Promise( (resolve, reject) => {
            uploader
                .uploader({uploadDir: "./uploads/", multiples: false}, request)
                .then(file => {
                    var error = [];
                    if (!regex.test(file.type))
                        error.push(`<p>Extensão Inválida, Tipo de Arquivo Aceito é: ${MIME_TYPES.join(',')}</p>`)
                    if (file.size > MAX_SIZE_UPLOAD)
                        error.push("<p>O Tamanho do Arquivo é Maior do que o Limite Aceito de 3MB</p>")
    
                    if (error.length > 0) {
                        fs.unlink(file.path)
                        return reject(error.join(''))
                    }
                    resolve(file)
                },
                err => reject(err)
            );
        })
    }

    /**
     * ---------------------------------------------------------------------------
     *  upload image from disc from s3 bucket
     * ---------------------------------------------------------------------------
     */
    const sendToBucket = (fileInstance, userId) => {
        let { generateFileString } = require("../modules/Utils")
        let hashString = generateFileString(fileInstance.name)
        let path = `${AWS.uploadFolder}/${userId}/${hashString}`

        return new Promise( (resolve,reject) => {
            uploader
            .s3Helper(AWS)
            .uploadObject(fileInstance, path, fileInstance.path)
            .then(
                data => resolve({ hashString, data }),
                err => reject(err)
            )
        })
    }

    return { save, removeObject, uploadFile, sendToBucket }
}