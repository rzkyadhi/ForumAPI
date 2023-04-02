class GetThreadDetailUseCase {
    constructor({
        threadRepository,
        commentRepository
    }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCaseParam) {
        const threadDetail = await this._threadRepository.getThreadDetailById(useCaseParam.threadId)
        const commentsDetail = await this._commentRepository.getCommentsByThreadId(useCaseParam.threadId)

        threadDetail.comments = commentsDetail.map(({
            id,
            username,
            date,
            is_deleted,
            content
        }) => ({
            id,
            username,
            date,
            content: is_deleted ? '**komentar telah dihapus**' : content
        }))

        return threadDetail
    }
}

module.exports = GetThreadDetailUseCase