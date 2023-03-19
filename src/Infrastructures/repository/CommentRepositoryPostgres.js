const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
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
            text: `SELECT id, thread_id, content, owner as username FROM comments WHERE comments.id = $1`,
            values: [id]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('comment tidak ditemukan')
        }
        return result.rows[0]
    }

    async verifyCommentIsExist({
        commentId,
        threadId
    }) {
        const isDeleted = false
        const query = {
            text: 'SELECT 1 from comments WHERE id = $1 AND thread_id = $2 AND is_deleted = $3',
            values: [commentId, threadId, isDeleted]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('comment tidak ditemukan')
        }
    }

    async verifyCommentAccess({
        commentId,
        owner
    }) {
        const query = {
            text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new AuthorizationError('anda tidak memiliki access untuk comment ini')
        }
    }

    async deleteCommentById(commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = TRUE WHERE id = $1 RETURNING id',
            values: [commentId]
        }
        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new NotFoundError('tidak dapat menghapus comment karena comment tidak ditemukan')
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `select comments.id, users.username as username, comments.date, 
                    CASE WHEN is_deleted = TRUE THEN '**komentar telah dihapus**' else comments.content END as content
                    FROM comments
                    JOIN users ON users.id = comments.owner
                    WHERE thread_id = $1
                    ORDER BY date ASC`,
            values: [threadId]
        }
        const result = await this._pool.query(query)
        return result.rows
    }
}

module.exports = CommentRepositoryPostgres