const pool = require('../../database/postgres/pool')
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
            const { data: { accessToken }} = JSON.parse(loginResponse.payload)
            
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
            expect(responseJson.status).toEqual('fail')
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
            const { data: { accessToken }} = JSON.parse(loginResponse.payload)
            
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
})