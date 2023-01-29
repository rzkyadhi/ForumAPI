const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'thread title',
            body: 'body of thread'
        }
        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'user-123'
        })
        const bearerToken = 'Bearer accessToken'
        const accessToken = 'accessToken'

        /* creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()

        /* mocking needed function */
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
            .mockImplementation(() => Promise.resolve(accessToken))
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: expectedAddedThread.owner
            }))
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread))

        /* creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager
        })

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload, bearerToken)

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread)
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(bearerToken)
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken)
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: expectedAddedThread.owner
        }))
    })
})