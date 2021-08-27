
exports.up = function (knex, Promise) {
    return knex.schema.createTable('images', table => {
        table.increments('id').primary()
        table.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('CASCADE')
        table.string('name').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('images')
};
