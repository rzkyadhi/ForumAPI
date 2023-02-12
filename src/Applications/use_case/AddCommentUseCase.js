const AddComment = require('../../Domains/comments/entities/AddComment')

class AddCommentUseCase {
    constructor({
        threadRepository,
        commentRepository,
        authenticationTokenManager
    }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(useCasePayload, bearerToken, useCaseParam) {
        await this._threadRepository.getThreadById(useCaseParam.threadId)
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(bearerToken)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {
            id: owner
        } = await this._authenticationTokenManager.decodePayload(accessToken)
        const addComment = new AddComment({
            thread_id: useCaseParam.threadId,
            ...useCasePayload,
            owner: owner
        })
        return this._commentRepository.addComment(addComment)
    }
}

module.exports = AddCommentUseCase