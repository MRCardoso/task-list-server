
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users_api', table => {
        table.increments('id').primary()
        table.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('CASCADE')
        table.string('name').notNull()
        table.string('version').notNull()
        table.integer('platform').notNull().defaultTo(1) // 1 - webtoken, 2 - mobile, 3 - third party
        table.text('token').notNull()
        table.bigInteger('expires').notNull()
        table.timestamp('created_at')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users_api')
};
