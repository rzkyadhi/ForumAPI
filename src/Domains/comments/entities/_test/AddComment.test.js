const AddComment = require('../AddComment')

describe('an AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            thread_id: 'thread-123',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            thread_id: 123,
            content: true,
            owner: 'user-123'
        }

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create addComment object correctly', () => {
        // Arrange
        const payload = {
            thread_id: 'thread-123',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            owner: 'user-123'
        }

        // Action
        const {
            thread_id,
            content,
            owner
        } = new AddComment(payload)

        // Assert
        expect(thread_id).toEqual(payload.thread_id)
        expect(content).toEqual(payload.content)
        expect(owner).toEqual(payload.owner)
    })
})