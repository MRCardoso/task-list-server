
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('username').notNull().unique()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('status').notNull().defaultTo(true)
        table.boolean('admin').notNull().defaultTo(false)
        table.string('resetToken')
        table.date('resetExpires')
        table.timestamp('deleted_at')
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
};
