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

        commentsDetail.forEach((comment) => {
            if (comment.is_deleted === true)
                comment.content = '**komentar telah dihapus**'
            delete comment.is_deleted
        });

        return {
            ...threadDetail,
            comments: commentsDetail
        }
    }
}

module.exports = GetThreadDetailUseCase