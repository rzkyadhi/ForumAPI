class DeleteCommentUseCase {
    constructor({
        commentRepository
    }) {
        this._commentRepository = commentRepository
    }

    async execute(owner, useCaseParam) {
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