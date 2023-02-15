/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('comments', {
        date: {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropColumns('comments', 'date')
};
