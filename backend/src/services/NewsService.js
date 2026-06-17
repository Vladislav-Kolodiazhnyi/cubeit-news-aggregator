const { NewsResponseDTO } = require('../dto/news.dto');

const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

class NewsService {

    constructor(newsRepository, categoryRepository, commentRepository, userRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    async getNewsList(queryParams) {
        const page = Math.max(1, parseInt(queryParams.page) || 1);
        const limit = Math.min(50, parseInt(queryParams.limit) || 12);
        const skip = (page - 1) * limit;

        const filter = {
            isActive: true,
            category: { $ne: null, $exists: true }
        };

        if (queryParams.category && queryParams.category !== 'All') {
            const categoryDoc = await this.categoryRepository.findBySlug(queryParams.category);

            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                filter.category = '000000000000000000000000';
            }
        }

        if (queryParams.source && queryParams.source !== 'All') {
            filter.source = queryParams.source;
        }

        if (queryParams.search) {
            const safeSearchQuery = escapeRegex(queryParams.search);
            filter.title = { $regex: safeSearchQuery, $options: 'i' };
        }

        let sort = { createdAt: -1 };
        if (queryParams.sort === 'oldest') {
            sort = { createdAt: 1 };
        }

        const { data, total } = await this.newsRepository.findAll({
            filter,
            skip,
            limit,
            sort
        });

        const formattedNews = data.map(news => new NewsResponseDTO(news));

        return {
            news: formattedNews,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getSourcesList() {
        return await this.newsRepository.getDistinctSources();
    }

    async getNewsById(id) {
        const news = await this.newsRepository.findById(id);

        if (!news || !news.isActive) {
            const error = new Error('News not found');
            error.statusCode = 404;
            throw error;
        }

        this.newsRepository.incrementViews(id).catch(err => console.error('Failed to increment views:', err));

        return new NewsResponseDTO(news);
    }

    async toggleLike(newsId, userId) {
        const news = await this.newsRepository.findById(newsId);

        if (!news || !news.isActive) {
            const error = new Error('News not found');
            error.statusCode = 404;
            throw error;
        }

        const isLiked = news.likes && news.likes.some(id => id.toString() === userId.toString());

        if (isLiked) {
            await this.newsRepository.removeLike(newsId, userId);
            return { isLiked: false };
        } else {
            await this.newsRepository.addLike(newsId, userId);
            return { isLiked: true };
        }
    }

    async createNews(newsData) {
        return await this.newsRepository.create(newsData);
    }

    async updateNews(id, newsData) {
        const updatedNews = await this.newsRepository.update(id, newsData);
        if (!updatedNews) {
            const error = new Error('News not found');
            error.statusCode = 404;
            throw error;
        }
        return new NewsResponseDTO(updatedNews);
    }

    async deleteNews(id) {
        const news = await this.newsRepository.findById(id);
        if (!news) {
            const error = new Error('News not found');
            error.statusCode = 404;
            throw error;
        }

        await Promise.all([
            this.commentRepository.deleteManyByNewsId(id),
            this.userRepository.removeNewsFromAllSaved(id)
        ]);

        await this.newsRepository.delete(id);

        return { message: 'News and all related data successfully deleted' };
    }

}

module.exports = NewsService;