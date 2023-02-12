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
})