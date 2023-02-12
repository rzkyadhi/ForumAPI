const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'owner-123'
        })
        const bearerToken = 'Bearer accessToken'
        const accessToken = 'accessToken'
        const useCaseParam = {
            threadId: 'thread-123'
        }

        /* creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()

        /* mocking needed function */
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
            .mockImplementation(() => Promise.resolve(accessToken))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: expectedAddedComment.owner
            }))
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedComment))

        /* creating use case instance */
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            authenticationTokenManager: mockAuthenticationTokenManager
        })

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload, bearerToken, useCaseParam)


        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId)
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(bearerToken)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken)
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            thread_id: useCaseParam.threadId,
            content: useCasePayload.content,
            owner: expectedAddedComment.owner
        }))
    })
})