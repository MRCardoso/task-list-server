
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('username').notNull().unique()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('status').notNull().defaultTo(true)
        table.boolean('admin').notNull().defaultTo(false)
        table.timestamps();
        // table.string('image')
        // reset token
        // table.string('resetToken')
        // table.date('resetExpires').defaultTo(Date.now)
        // apis to save data
        // table.integer('userApis')
        // OAuth Credentials Providers, maybe table providers
        // table.string('provider')
        // table.integer('providerId')
        // table.text('providerData')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
};
