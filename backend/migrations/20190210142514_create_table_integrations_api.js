
exports.up = function(knex, Promise) {
    return knex.schema.createTable('integrations_api', table => {
        table.increments('id').primary()
        table.text('description').notNull()
        table.integer('platform').notNull().defaultTo(1) // 1 - mobile, 1 - third party
        table.timestamp('deleted_at')
        table.timestamps()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('integrations_api')
};
