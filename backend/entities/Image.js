const Model = require('../modules/Model');

class Image extends Model {
    constructor(app) {
        const fillables = ["id", "userId", "name"]
        const rules = {
            "userId"        : "required|number",
            "name"          : "required|max:250"
        }
        super(app, "images", rules, fillables)
        this.timestamps = false
    }

    relations(alias) {
        let relations = {
            "users": ["users", "id", "userId", ["users.name", "users.email"]]
        };
        return relations[alias]
    }

    imagesByUser(userId){
        return new Promise( (resolve) => {
            let { AWS } = require('../.env')
            this.all().where({ userId })
            .then(images => {
                let listImages = []
                images.forEach(i => {
                    listImages.push({
                        id: i.id,
                        userId: i.userId,
                        name: i.name,
                        url: `${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}/${i.userId}/${i.name}`
                    })
                })
                resolve(listImages)
            })
            .catch(() => resolve([]))

        })
    }
    imageByUser(userId){
        return new Promise( resolve => {
            this.one({ userId })
                .then(i => {
                    let { AWS } = require('../.env')
                    resolve(`${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}/${i.userId}/${i.name}`)
                })
                .catch(() => resolve(null))
        })
    }
}

module.exports = Image