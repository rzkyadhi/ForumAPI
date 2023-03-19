const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddComment = require('../../../Domains/comments/entities/AddComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange
            const addComment = new AddComment({
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await commentRepositoryPostgres.addComment(addComment)

            // Assert
            const comments = await CommentsTableTestHelper.findCommentById('comment-123')
            expect(comments).toHaveLength(1)
        })

        it('should return added comment correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange
            const addComment = new AddComment({
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment)

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            }))
        })
    })

    describe('getCommentById function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.getCommentById('comment-920192'))
                .rejects
                .toThrowError(NotFoundError)
        })

        it('should return comment correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            const addComment = {
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            }
            const expectedAddedComment = {
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                username: 'user-123'
            }
            await CommentsTableTestHelper.addComment(addComment)
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const comment = await commentRepositoryPostgres.getCommentById('comment-find')

            // Assert
            expect(comment).toStrictEqual(expectedAddedComment)
        })
    })

    describe('verifyCommentIsExist function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentIsExist({
                    commentId: 'comment-920192',
                    threadId: 'thread-920192'
                }))
                .rejects
                .toThrowError(NotFoundError)
        })
        it('should throw NotFoundError when comment already deleted', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123',
                is_deleted: true
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentIsExist({
                    commentId: 'comment-find',
                    threadId: 'thread-123'
                }))
                .rejects
                .toThrowError(NotFoundError)
        })
        it('should resolve function correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentIsExist({
                    commentId: 'comment-find',
                    threadId: 'thread-123'
                }))
                .resolves
                .toBeUndefined()
        })
    })

    describe('verifyCommentAccess function', () => {
        it('should throw AuthorizationError when user have no authorization', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentAccess({
                    commentId: 'comment-find',
                    owner: 'owner-not-found'
                }))
                .rejects
                .toThrowError(AuthorizationError)
        })
        it('should resolve function correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentAccess({
                    commentId: 'comment-find',
                    owner: 'user-123'
                }))
                .resolves
                .toBeUndefined()
        })
    })

    describe('deleteCommentById function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.deleteCommentById('comment-920192'))
                .rejects
                .toThrowError(NotFoundError)
        })
        it('should resolve function correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment
            await CommentsTableTestHelper.addComment({
                id: 'comment-find',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123'
            })

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action & Assert
            await expect(commentRepositoryPostgres.deleteCommentById('comment-find')).resolves.toBeUndefined()

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById('comment-find')
            expect(comment[0].is_deleted).toEqual(true)
        })
    })

    describe('getCommentsByThreadId function', () => {
        it('should resolve function correctly', async () => {
            // Arrange & Action addUser
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            })

            // Arrange & Action addThread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'Menjadi Back-End Developer Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                owner: 'user-123'
            })

            // Arrange & Action addComment with is_deleted = false
            const addCommentFalse = {
                id: 'comment-false',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123',
                date: '2023-02-22 17:26:09'
            }
            await CommentsTableTestHelper.addComment(addCommentFalse)

            // Arrange & Action addComment with is_deleted = true
            const addCommentTrue = {
                id: 'comment-true',
                thread_id: 'thread-123',
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                owner: 'user-123',
                date: '2023-02-22 19:26:09',
                is_deleted: true
            }
            await CommentsTableTestHelper.addComment(addCommentTrue)

            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

            // Action
            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123')

            // Assert
            expect(comments).toEqual([{
                    id: 'comment-false',
                    username: 'dicoding',
                    date: '2023-02-22 17:26:09',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                },
                {
                    id: 'comment-true',
                    username: 'dicoding',
                    date: '2023-02-22 19:26:09',
                    content: '**komentar telah dihapus**'
                }
            ])
        })
    })
})