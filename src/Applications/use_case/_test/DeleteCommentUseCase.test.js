const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const bearerToken = 'Bearer accessToken'
        const accessToken = 'accessToken'
        const useCaseParam = {
            threadId: 'thread-123',
            commentId: 'comment-123'
        }
        const expectedValue = {
            expectedOwner: 'owner-123',
            expectedCommentId: 'comment-123'
        }

        const mockCommentRepository = new CommentRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()

        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
            .mockImplementation(() => Promise.resolve(accessToken))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: expectedValue.expectedOwner
            }))
        mockCommentRepository.verifyCommentIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentAccess = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve())

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            authenticationTokenManager: mockAuthenticationTokenManager
        })

        // action
        await deleteCommentUseCase.execute(bearerToken, useCaseParam)

        // Assert
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(bearerToken)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken)
        expect(mockCommentRepository.verifyCommentIsExist).toBeCalledWith({
            commentId: useCaseParam.commentId,
            threadId: useCaseParam.threadId
        })
        expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
            commentId: useCaseParam.commentId,
            owner: expectedValue.expectedOwner
        })
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(expectedValue.expectedCommentId)
    })
})