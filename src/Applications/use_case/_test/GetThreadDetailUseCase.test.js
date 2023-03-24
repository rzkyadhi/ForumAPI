const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase')

describe('GetThreadDetailUseCase', () => {
    it('should orchestrating the get thread detail action correctly', async () => {
        // Arrange
        const useCaseParam = {
            threadId: 'thread-123'
        }
        const expectedThreadDetail = {
            id: "thread-h_2FkLZhtgBKY2kh4CC02",
            title: "sebuah thread",
            body: "sebuah body thread",
            date: "2021-08-08T07:19:09.775Z",
            username: "dicoding",
            comments: []
        }
        const expectedComments = [{
                id: "comment-_pby2_tmXV6bcvcdev8xk",
                username: "johndoe",
                date: "2021-08-08T07:22:33.555Z",
                content: "sebuah comment"
            },
            {
                id: "comment-yksuCoxM2s4MMrZJO-qVD",
                username: "dicoding",
                date: "2021-08-08T07:26:21.338Z",
                content: "**komentar telah dihapus**"
            }
        ]
        /* creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /* mocking needed function */
        mockThreadRepository.getThreadDetailById = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThreadDetail))
        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComments))

        /* creating use case instance */
        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const threadDetail = await getThreadDetailUseCase.execute(useCaseParam)

        // Expect
        expect(threadDetail).toEqual({
            ...expectedThreadDetail,
            comments: expectedComments
        })
        expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCaseParam.threadId)
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId)
    })
})