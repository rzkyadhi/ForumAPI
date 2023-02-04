const routes = (handler) => ([
    {
        method: 'POST',
        path: '/users',
        handler: handler.postThreadHandler
    }
])

module.exports = routes