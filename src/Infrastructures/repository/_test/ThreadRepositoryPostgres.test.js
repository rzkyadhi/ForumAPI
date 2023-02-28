const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange
            const addThread = new AddThread({
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(addThread)

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123')
            expect(threads).toHaveLength(1)
        })

        it('should return added thread correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange
            const addThread = new AddThread({
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(addThread)

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                owner: 'user-123'
            }))
        })
    })

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(threadRepositoryPostgres.getThreadById('thread-123'))
                .rejects
                .toThrowError(NotFoundError)
        })

        it('should return thread correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            const addThread = {
                id : 'thread-123',
                title : 'Menjadi Back-End Developer Super Expert',
                body : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner : 'user-123'
            }

            const expectedAddedThread = {
                id : 'thread-123',
                title : 'Menjadi Back-End Developer Super Expert',
                body : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                username : 'user-123'
            }
            await ThreadsTableTestHelper.addThread(addThread)
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action
            const thread = await threadRepositoryPostgres.getThreadById('thread-123')

            // Assert
            expect(thread.id).toEqual(expectedAddedThread.id)
            expect(thread.title).toEqual(expectedAddedThread.title)
            expect(thread.body).toEqual(expectedAddedThread.body)
            expect(thread.username).toEqual(expectedAddedThread.username)
        })
    })
})