const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCaseOwner = 'user-123'
        const useCasePayload = {
            title: 'thread title',
            body: 'body of thread'
        }
        useCasePayload.owner = useCaseOwner
        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123'
        })

        /* creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()

        /* mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedThread({
                id: 'thread-123',
                title: useCasePayload.title,
                owner: 'user-123'
            })))

        /* creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        })

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload)

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread)
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner
        }))
    })
})