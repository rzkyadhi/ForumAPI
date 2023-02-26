const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
    constructor(container) {
        this._container = container

        this.postCommentHandler = this.postCommentHandler.bind(this)
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
    }

    async postCommentHandler(request, h) {
        const headerAuthorization = request.headers.authorization
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
        const addedComment = await addCommentUseCase.execute(request.payload, headerAuthorization, request.params)

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
        const headerAuthorization = request.headers.authorization
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
        await deleteCommentUseCase.execute(headerAuthorization, request.params)

        return {
            status: 'success'
        }
    }
}

module.exports = CommentsHandler