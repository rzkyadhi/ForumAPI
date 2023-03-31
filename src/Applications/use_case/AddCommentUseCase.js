const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentUseCase {
    constructor({
        threadRepository,
        commentRepository
    }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload, useCaseParam) {
        await this._threadRepository.verifyThreadAvailability(useCaseParam.threadId)
        const addComment = new AddComment({
            thread_id: useCaseParam.threadId,
            ...useCasePayload
        })
        return this._commentRepository.addComment(addComment)
    }
}

module.exports = AddCommentUseCase