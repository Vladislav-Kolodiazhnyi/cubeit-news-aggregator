class CommentResponseDTO {
    constructor(comment) {
        this.id = comment._id.toString();
        this.text = comment.text;
        this.newsId = comment.news.toString();
        this.createdAt = comment.createdAt;
        //this.updatedAt = comment.updatedAt;

        if (comment.author && typeof comment.author === 'object') {
            this.author = {
                id: comment.author._id.toString(),
                username: comment.author.username,
                avatar: comment.author.avatar || ''
            };
        } else {
            this.author = comment.author;
        }
    }
}

module.exports = { CommentResponseDTO };