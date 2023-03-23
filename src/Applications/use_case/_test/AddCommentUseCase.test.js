const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const expectedOwner = 'owner-123'
        const useCasePayload = {
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
        }
        useCasePayload.owner = expectedOwner
        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'owner-123'
        })
        const useCaseParam = {
            threadId: 'thread-123'
        }

        /* creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /* mocking needed function */
        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedComment))

        /* creating use case instance */
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParam)


        // Assert
        expect(addedComment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParam.threadId)
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            thread_id: useCaseParam.threadId,
            content: useCasePayload.content,
            owner: useCasePayload.owner
        }))
    })
})