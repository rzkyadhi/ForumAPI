const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret',
                    fullname: 'Rizky Adhi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)

            const requestPayload = {
                title: 'Menjadi Quality Assurance Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
            expect(responseJson.data.addedThread.id).toBeDefined()
            expect(responseJson.data.addedThread.title).toBeDefined()
            expect(responseJson.data.addedThread.owner).toBeDefined()
        })
        it('should response 401 if there is no header authorization', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret',
                    fullname: 'Rizky Adhi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret'
                }
            })

            const requestPayload = {
                title: 'Menjadi Quality Assurance Expert',
                body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
            expect(responseJson.message).toEqual('Missing authentication')
        })
        it('should response 400 if thread payload not contain needed property', async () => {
            // Arrange
            const server = await createServer(container)
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret',
                    fullname: 'Rizky Adhi'
                }
            })
            // login user
            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken
                }
            } = JSON.parse(loginResponse.payload)

            const requestPayload = {
                title: 'Menjadi Quality Assurance Expert'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
        })
    })

    describe('when GET /threads', () => {
        it('should response 200 if thread is available', async () => {
            // Arrange
            const server = await createServer(container)

            const users = [{
                    username: 'khnsvi',
                    password: 'secret',
                    fullname: 'Khansa Avi'
                },
                {
                    username: 'rzkyadhi',
                    password: 'secret',
                    fullname: 'Rizky Adhi'
                }
            ];
            await Promise.all(users.map(user =>
                server.inject({
                    method: 'POST',
                    url: '/users',
                    payload: user
                })
            ));
            // login user 1
            const loginResponseUserOne = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'khnsvi',
                    password: 'secret'
                }
            })
            const {
                data: {
                    accessToken: accessTokenUserOne,
                    refreshToken: refreshTokenUserOne
                }
            } = JSON.parse(loginResponseUserOne.payload)
            // add thread by user 1
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'Menjadi Front-End Developer Expert',
                    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                },
                headers: {
                    Authorization: `Bearer ${accessTokenUserOne}`
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
            await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'Saya ingin menjadi front-end developer yang handal !'
                },
                headers: {
                    Authorization: `Bearer ${accessTokenUserOne}`
                }
            })

            // Logout user 1
            await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {
                    refreshToken: refreshTokenUserOne
                }
            })

            // Login user 2
            const loginResponseUserTwo = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'rzkyadhi',
                    password: 'secret'
                }
            })

            const {
                data: {
                    accessToken: accessTokenUserTwo,
                }
            } = JSON.parse(loginResponseUserTwo.payload)

            // add comment
            const commentUserTwo = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'Saya ingin menjadi front-end developer yang handal !'
                },
                headers: {
                    Authorization: `Bearer ${accessTokenUserTwo}`
                }
            })
            const {
                data: {
                    addedComment: {
                        id: commentIdUserTwo
                    }
                }
            } = JSON.parse(commentUserTwo.payload)

            // delete comment user two
            await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentIdUserTwo}`,
                headers: {
                    Authorization: `Bearer ${accessTokenUserTwo}`
                }
            })

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.thread).toBeDefined()
            expect(responseJson.data.thread.id).toBeDefined()
            expect(responseJson.data.thread.title).toBeDefined()
            expect(responseJson.data.thread.body).toBeDefined()
            expect(responseJson.data.thread.date).toBeDefined()
            expect(responseJson.data.thread.username).toBeDefined()
            expect(responseJson.data.thread.comments).toHaveLength(2)
            expect(responseJson.data.thread.comments[0].id).toBeDefined()
            expect(responseJson.data.thread.comments[0].username).toBeDefined()
            expect(responseJson.data.thread.comments[0].date).toBeDefined()
            expect(responseJson.data.thread.comments[0].content).toBeDefined()
            expect(responseJson.data.thread.comments[1].id).toBeDefined()
            expect(responseJson.data.thread.comments[1].username).toBeDefined()
            expect(responseJson.data.thread.comments[1].date).toBeDefined()
            expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**')
        })
        it('should response 404 if thread not found or not valid', async () => {
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
            await server.inject({
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
                method: 'GET',
                url: `/threads/thread-not-found`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('thread tidak ditemukan')
        })
    })
})