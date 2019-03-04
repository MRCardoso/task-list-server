const Model = require('../modules/Model');

/**
 * @author Marlon R. Cardoso
 * @property {int} id the primary key the the table
 * @property {int} userId the user foreign of this model
 * @property {string} name the name of this model
 */
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

    static imageAsObject(i){
        let { AWS } = require('../.env')
        return {
            id: i.id,
            userId: i.userId,
            name: i.name,
            url: `${AWS.URL}${AWS.Bucket}/${AWS.uploadFolder}/${i.userId}/${i.name}`
        }
    }

    relations(alias) {
        let relations = {
            "users": ["users", "id", "userId", ["users.name", "users.email"]]
        };
        return relations[alias]
    }

    imagesByUser(userId){
        return new Promise( (resolve) => {
            this.all().where({ userId })
            .then(images => {
                let listImages = []
                images.forEach(i => listImages.push(Image.imageAsObject(i)))
                resolve(listImages)
            })
            .catch(() => resolve([]))

        })
    }
    imageByUser(userId){
        return new Promise( resolve => {
            this.one({ userId })
                .then(i => resolve(Image.imageAsObject(i).url))
                .catch(() => resolve(null))
        })
    }
}

module.exports = Image