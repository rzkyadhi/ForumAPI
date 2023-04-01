exports.up = pgm => {
    pgm.addColumns('threads', {
        date: {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropColumns('threads', 'date')
};
