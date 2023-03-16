class GetThreadDetailUseCase {
    constructor({
        threadRepository,
        commentRepository
    }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCaseParam) {
        const threadDetail = await this._threadRepository.getThreadById(useCaseParam.threadId)
        const commentsDetail = await this._commentRepository.getCommentsByThreadId(useCaseParam.threadId)
        return {
            ...threadDetail,
            comments: commentsDetail
        }
    }
}

module.exports = GetThreadDetailUseCase