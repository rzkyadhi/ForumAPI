const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(addComment) {
        const {
            thread_id,
            content,
            owner
        } = addComment
        const id = `comment-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, thread_id, content, owner]
        }

        const result = await this._pool.query(query)

        return new AddedComment({
            ...result.rows[0]
        })
    }

    async getCommentById(id) {
        const query = {
            text: `SELECT * FROM comments WHERE comments.id = $1`,
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('comment tidak ditemukan')
        }
        return result.rows[0]
    }
}

module.exports = CommentRepositoryPostgres