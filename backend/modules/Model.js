const Validator = require('./Validator')
const timestamps = ["created_at", "updated_at"]

/**
 * @property {object} app the app created in the express
 * @property {string} table the table name in the database of the instance of model
 * @property {object} fillables the fields allowed to work in the sql methods (select, inset and update)
 * @property {object} hiddens the fields hidden in the sql methods (select, inset and update)
 * @property {object} rules the validations of the model instance
 * @property {Validator} validator the instance of the class Validator to make the validations
 * @property {object} attributes the magic attributes of the model created in constructor
 * @property {bool} timestamps the definition if the model has create and update dates
 */
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

        this.resertFields()
    }

    resertFields()
    {
        let fields = this.fillables.concat(this.hiddens)
        fields.forEach((value) => {
            this[value] = null
            this.attributes[value] = null
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
        if ('id' in data){
            delete data.id
        }
        return this.app.db(this.table).update(data).where({ id: this.id })
    }

    delete(params, method = 'where'){
        let query = this.app.db(this.table)
        if (Array.isArray(params)){
            query[method](...params)
        } else{
            query[method](params)
        }
        
        return query.del()
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
            this.resertFields()
            this.bindFillables(data)

            if(!this.validator.validate(data)){
                return reject({ Validator: this.validator.getErrors()});
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
                    let insertedId = (Array.isArray(r) ? r[0] : r)
                    this.afterSave(insertedId).then(
                        () => resolve(insertedId),
                        err => reject(err)
                    )
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
    afterSave() { return Promise.resolve() }

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
    * @param {object} params of the filter data
    * @param {array} relations thie joins with the foreign tables
    * @param {bool|array} hiddenOrCustom the custom field or use the hidden field
    * @return Promise
    */
    one(params, relations = [], hiddenOrCustom = false){
        let query = this.app.db(this.table)
        let fields = ['id']
        
        if (Array.isArray(hiddenOrCustom)){
            fields = hiddenOrCustom
        } else{
            fields = this.getFields(hiddenOrCustom).concat(this.prepareJoin(relations, query))
        }

        return new Promise( (resolve, reject) => {
            query
                .select(...fields)
                .where(params)
                .first()
                .then(item => (item ? resolve(item) : reject(`nenhum resultado encontrado em '${this.table}'`)))
                .catch(err => reject(err))
        })
    }

    all(relations = [], hiddenOrCustom = false){
        let query = this.app.db(this.table)
        let fields = ['id']
        
        if (Array.isArray(hiddenOrCustom)){
            fields = hiddenOrCustom
        } else{
            fields = this.getFields(hiddenOrCustom).concat(this.prepareJoin(relations, query))
        }

        query.select(...fields)

        return query
    }
}

module.exports = Model;