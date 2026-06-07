const { CommentResponseDTO } = require('../dto/comment.dto');

class CommentService {
    constructor(commentRepository, newsRepository) {
        this.commentRepository = commentRepository;
        this.newsRepository = newsRepository;
    }

    async addComment(newsId, userId, text) {
        const comment = await this.commentRepository.create({
            news: newsId,
            author: userId,
            text
        });

        await this.newsRepository.updateCommentsCount(newsId, 1);

        //return comment;
        return new CommentResponseDTO(comment);
    }

    async getNewsComments(newsId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        //return await this.commentRepository.findByNewsId(newsId, skip, limit);
        const comments = await this.commentRepository.findByNewsId(newsId, skip, limit);
        
        return comments.map(comment => new CommentResponseDTO(comment));
    }

    async deleteComment(commentId, userId, userRole) {
        const comment = await this.commentRepository.findById(commentId);
        
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }

        if (comment.author.toString() !== userId.toString() && userRole !== 'admin') {
            const error = new Error('Not authorized to delete this comment');
            error.statusCode = 403;
            throw error;
        }

        await this.commentRepository.delete(commentId);
        
        await this.newsRepository.updateCommentsCount(comment.news, -1);

        return { message: 'Comment removed' };
    }
}

module.exports = CommentService;