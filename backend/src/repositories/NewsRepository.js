const News = require('../models/News');

class NewsRepository {

    async findBySourceLink(link) {
        return await News.findOne({ sourceLink: link }).lean();
    }

    async create(newsData) {
        const news = new News(newsData);
        return await news.save();
    }

    async insertMany(newsArray) {
        return await News.insertMany(newsArray, { ordered: false });
    }
    
    async findById(id) {
        return await News.findById(id)
            .populate('category', 'name slug')
            .lean();
    }

    async findAll({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) {
        const [data, total] = await Promise.all([
            News.find(filter)
                .populate('category', 'name slug')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            News.countDocuments(filter)
        ]);

        return { data, total };
    }

    async incrementViews(id) {
        return await News.findByIdAndUpdate(
            id, 
            { $inc: { viewsCount: 1 } }, 
            { new: true }
        ).lean();
    }

    async updateCommentsCount(newsId, amount) {
        return await News.findByIdAndUpdate(
            newsId,
            { $inc: { commentsCount: amount } }
        ).lean();
    }

    async addLike(newsId, userId) {
        return await News.findByIdAndUpdate(
            newsId,
            { $addToSet: { likes: userId } },
            { new: true }
        ).lean();
    }

    async removeLike(newsId, userId) {
        return await News.findByIdAndUpdate(
            newsId,
            { $pull: { likes: userId } },
            { new: true }
        ).lean();
    }

    async saveNews(newsId, userId) {
        return await News.findByIdAndUpdate(
            newsId,
            { $addToSet: { savedBy: userId } },
            { new: true }
        ).lean();
    }
    
    async unsaveNews(newsId, userId) {
        return await News.findByIdAndUpdate(
            newsId,
            { $pull: { savedBy: userId } },
            { new: true }
        ).lean();
    }

    async getPendingNews(limit = 5) {
        return await News.find({ aiStatus: 'pending' }).limit(limit).lean();
    }

    async updateAIResult(id, aiData) {
        return await News.findByIdAndUpdate(
            id,
            {
                $set: {
                    category: aiData.category,
                    tags: aiData.tags,
                    aiStatus: 'completed'
                }
            },
            { new: true }
        ).lean();
    }

    async markAsFailed(id) {
        return await News.findByIdAndUpdate(
            id,
            { $set: { aiStatus: 'failed' } }
        ).lean();
    }

    async update(id, newsData) {
        return await News.findByIdAndUpdate(
            id,
            { $set: newsData },
            { new: true, runValidators: true }
        ).lean();
    }
    
    async delete(id) {
        return await News.findByIdAndDelete(id).lean();
    }

    async removeUserFromAllLikesAndSaves(userId) {
        return await News.updateMany(
            {},
            { $pull: { likes: userId, savedBy: userId } }
        );
    }
    
    async getDistinctSources() {
        return await News.distinct('source', { isActive: true });
    }
}

module.exports = new NewsRepository();