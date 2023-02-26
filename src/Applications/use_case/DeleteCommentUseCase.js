class DeleteCommentUseCase {
    constructor({
        commentRepository,
        authenticationTokenManager
    }) {
        this._commentRepository = commentRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute(bearerToken, useCaseParam) {
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(bearerToken)
        await this._authenticationTokenManager.verifyAccessToken(accessToken)
        const {
            id: owner
        } = await this._authenticationTokenManager.decodePayload(accessToken)
        await this._commentRepository.verifyCommentIsExist({
            commentId: useCaseParam.commentId,
            threadId: useCaseParam.threadId
        })
        await this._commentRepository.verifyCommentAccess({
            commentId: useCaseParam.commentId,
            owner: owner
        })
        await this._commentRepository.deleteCommentById(useCaseParam.commentId)
    }
}

module.exports = DeleteCommentUseCase