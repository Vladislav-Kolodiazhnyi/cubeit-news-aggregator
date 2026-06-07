class NewsResponseDTO {
    constructor(news) {
        this.id = news._id.toString();
        this.title = news.title;
        this.description = news.description;
        this.sourceLink = news.sourceLink;
        this.image = news.image;
        this.source = news.source;
        this.category = news.category;
        this.tags = news.tags || [];

        this.likes = news.likes || [];

        this.viewsCount = news.viewsCount || 0;
        this.likesCount = news.likes ? news.likes.length : 0;
        this.commentsCount = news.commentsCount || 0;
        this.aiStatus = news.aiStatus;
        this.createdAt = news.createdAt;
    }
}

module.exports = { NewsResponseDTO };