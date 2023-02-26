const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            const requestPayload = {
                content: 'Saya ingin menjadi front-end developer yang handal !'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedComment).toBeDefined()
            expect(responseJson.data.addedComment.id).toBeDefined()
            expect(responseJson.data.addedComment.content).toBeDefined()
            expect(responseJson.data.addedComment.owner).toBeDefined()
        })
        it('should response 401 if there is no header authorization', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            const requestPayload = {
                content: 'Saya ingin menjadi front-end developer yang handal !'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Missing authentication')
        })
        it('should response 400 if comment payload not contain needed property', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            const requestPayload = {
                comment: 'yoyoyoooy'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada')
        })
    })

    describe('when DELETE /comments', () => {
        it('should response 200 and success status', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            // add comment
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'Saya ingin menjadi front-end developer yang handal !'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedComment: {
                        id: commentId
                    }
                }
            } = JSON.parse(comment.payload)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
        it('should response 403 if user is not the owner of comment', async () => {
            // Arrange
            const server = await createServer(container)
            // User 1
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })

            // User 2
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret',
                    fullname: 'Rizky Adhi'
                }
            })
            // login user 1
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread by user 1
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            // add comment
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'Saya ingin menjadi front-end developer yang handal !'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedComment: {
                        id: commentId
                    }
                }
            } = JSON.parse(comment.payload)

            // Logout user 1
            await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {
                    refreshToken: refreshToken
                }
            })

            // Login user 2
            const loginResponseUser2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret'
                }
            })

            const {
                data: {
                    accessToken: accessTokenUser2,
                }
            } = JSON.parse(loginResponseUser2.payload)
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessTokenUser2}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('anda tidak memiliki access untuk comment ini')
        })
        it('should response 404 if comment not found or not valid', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)
            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const {
                data: {
                    addedThread: {
                        id: threadId
                    }
                }
            } = JSON.parse(thread.payload)

            // add comment
            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'Saya ingin menjadi front-end developer yang handal !'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-not-found`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('comment tidak ditemukan')
        })
    })
})