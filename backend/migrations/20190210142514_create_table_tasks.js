
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary()
        table.integer('userId').unsigned().notNull().references('id').inTable('users').onUpdate('CASCADE')
        table.string('title').notNull()
        table.text('description')
        table.integer('priority').notNull().defaultTo(1)
        table.integer('situation').notNull().defaultTo(1)
        table.boolean('status').notNull().defaultTo(true)
        table.date('startDate').notNull()
        table.date('endDate')
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tasks')
};
