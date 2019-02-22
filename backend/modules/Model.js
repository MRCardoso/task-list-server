const Validator = require('./Validator')
const timestamps = ["created_at", "updated_at"]

class Model {
    constructor(app, table, rules, fillables, hiddens = []) {
        this.app = app
        this.table = table
        this.fillables = fillables
        this.hiddens = hiddens
        this.rules = rules
        this.validator = new Validator(this.rules)
        this.attributes = {}
        this.timestamps = true

        let fields = this.fillables.concat(this.hiddens)
        fields.forEach((value) => {
            if (this[value] == undefined){
                this[value] = null
                this.attributes[value] = null
            }
        })
    }

    /**
    | ----------------------------------------------------------------------------
    | Fill the properties of the class, according the post sent that exists in fillables
    | ----------------------------------------------------------------------------
    * @param object data the data sent
    * @return array||bool
    */
    bindFillables(data) {
        for (let field in data) {
            let item = data[field]
            if (this.fillables.indexOf(field) != -1 || this.hiddens.indexOf(field) != -1) {
                this[field] = item
                this.attributes[field] = item
            }
        }
    }

    /**
     * ----------------------------------------------------------------------------
     * Update the properties in the attributes property the value in the respective property key
     * ----------------------------------------------------------------------------
     */
    refrashAttributes(){
        for (let field in this.attributes){
            this.attributes[field] = this[field]
        }
    }

    getFields(useHidden = true){
        let fields = this.fillables;
        if (useHidden){
            fields = fields.concat(this.hiddens);
        }
        if(this.timestamps){
            fields = fields.concat(timestamps)
        }
        return fields.map(r => `${this.table}.${r}`)
    }

    relations(alias) {
        return {};
    }

    /**
    | ----------------------------------------------------------------------------
    | INSERT Record
    | ----------------------------------------------------------------------------
    * @param object data the fields to be inserting
    * @return Promise
    */
    create(data) {
        if (this.timestamps){
            data[timestamps[0]] = new Date()
        }
        return this.app.db(this.table).insert(data)
    }

    /**
    | ----------------------------------------------------------------------------
    | UPDATE Record
    | ----------------------------------------------------------------------------
    * @param object data the fields to be updated
    * @return Promise
    */
    update(data) {
        if (this.timestamps) {
            data[timestamps[1]] = new Date()
        }
        return this.app.db(this.table).update(data).where({ id: this.id })
    }

    delete(params){
        return this.app.db(this.table).where(params).del()
    }
    /**
    | ----------------------------------------------------------------------------
    | CREATE OR UPDATE a Record
    | validate the fields sent in $data and check in fillables to set the data
    | ----------------------------------------------------------------------------
    * @param object data the fields to be updated
    * @param int|null the id of the record to update
    * @return bool
    */
    save (data) {
        return new Promise((resolve, reject) =>
        {
            this.bindFillables(data);

            if(!this.validator.validate(data)){
                return reject(this.validator.getErrors());
            }

            this.beforeSave().then(() => {
                let result = null;
                this.refrashAttributes()

                if (this.id){
                    result = this.update(this.attributes);
                } else{
                    result = this.create(this.attributes);
                }
                
                result.then(r => {
                    this.afterSave()
                    resolve((Array.isArray(r) ? r[0] : r))
                }).catch(err => reject(err))
            }, (err) => reject(err))
        })
    }

    /**
     * ----------------------------------------------------------------------------
     * Behavior to process a logic before save the record
     * ----------------------------------------------------------------------------
     */
    beforeSave(){
        return Promise.resolve()
    }

    /**
     * ----------------------------------------------------------------------------
     * Behavior to process a logic after save the record
     * ----------------------------------------------------------------------------
     */
    afterSave(){ }

    /**
     * ----------------------------------------------------------------------------
     * Behavior to process the join relation
     * ----------------------------------------------------------------------------
     */
    prepareJoin(relations, query) {
        let joinFields = []
        if (relations) {
            relations.forEach(r => {
                let array = this.relations(r)
                joinFields = joinFields.concat(array[3])
                query.innerJoin(array[0], `${array[0]}.${array[1]}`, `${this.table}.${array[2]}`)
            })
        }
        return joinFields
    }

    /**
    | ----------------------------------------------------------------------------
    | Find by a specific record in db
    | ----------------------------------------------------------------------------
    * @param object params of the filter data
    * @return Promise
    */
    one(params, relations = [], useHidden = false){
        let query = this.app.db(this.table)
        let fields = this.getFields(useHidden).concat(this.prepareJoin(relations, query))

        return query
            .select(...fields)
            .where(params)
            .first()
    }

    all(relations = [], useHidden = false){
        let query = this.app.db(this.table)
        let fields = this.getFields(useHidden).concat(this.prepareJoin(relations, query))

        query.select(...fields)

        return query
    }
}

module.exports = Model;