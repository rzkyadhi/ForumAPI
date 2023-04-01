const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const expectedOwner = 'owner-123'
        const useCaseParam = {
            threadId: 'thread-123',
            commentId: 'comment-123'
        }
        const expectedValue = {
            expectedOwner: 'owner-123',
            expectedCommentId: 'comment-123'
        }

        const mockCommentRepository = new CommentRepository()

        mockCommentRepository.verifyCommentIsExist = jest.fn(() => Promise.resolve())
        mockCommentRepository.verifyCommentAccess = jest.fn(() => Promise.resolve())
        mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve())

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository
        })

        // action
        await deleteCommentUseCase.execute(expectedOwner, useCaseParam)

        // Assert
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith({
            commentId: useCaseParam.commentId,
            threadId: useCaseParam.threadId
        })
        expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
            commentId: useCaseParam.commentId,
            owner: expectedOwner
        })
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(expectedValue.expectedCommentId)
    })
})