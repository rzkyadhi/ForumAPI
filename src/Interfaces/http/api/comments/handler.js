const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container

        this.postCommentHandler = this.postCommentHandler.bind(this)
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    }

    async postCommentHandler(request, h) {
        const {
            id: owner
        } = request.auth.credentials
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const addedComment = await addCommentUseCase.execute({
            ...request.payload,
            owner
        }, request.params)

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            }
        })
        response.code(201)
        return response
    }

    async deleteCommentHandler(request) {
        const {
            id: owner
        } = request.auth.credentials
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        await deleteCommentUseCase.execute(owner, request.params)

        return {
            status: 'success'
        }
    }
}

module.exports = CommentsHandler