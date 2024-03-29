const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(addThread) {
        const {
            title,
            body,
            owner
        } = addThread
        const id = `thread-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner]
        }

        const result = await this._pool.query(query)

        return new AddedThread({
            ...result.rows[0]
        })
    }

    async verifyThreadAvailability(id) {
        const query = {
            text: `SELECT 1 FROM threads WHERE threads.id = $1`,
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan')
        }
    }

    async getThreadDetailById(id) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username as username
                   FROM threads JOIN users 
                   ON users.id = threads.owner
                   WHERE threads.id = $1`,
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('thread tidak ditemukan')
        }
        return result.rows[0]
    }
}

module.exports = ThreadRepositoryPostgres