const mongoose = require('mongoose');
const Comment = require('../models/Comment');

class CommentRepository {
    async create(commentData) {
        const comment = new Comment(commentData);
        return await comment.save();
    }

    async findByNewsId(newsId, skip = 0, limit = 20) {
        return await Comment.find({ news: newsId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar')
            .lean();
    }

    async findById(id) {
        return await Comment.findById(id).lean();
    }

    async delete(id) {
        return await Comment.findByIdAndDelete(id).lean();
    }
    
    async deleteManyByNewsId(newsId) {
        return await Comment.deleteMany({ news: newsId }); 
    }

    async deleteManyByUserId(userId) {
        return await Comment.deleteMany({ author: userId }); 
    }

    async getCommentCountsByUserId(userId) {
        return await Comment.aggregate([
            { $match: { author: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$news", count: { $sum: 1 } } }
        ]);
    }
}

module.exports = new CommentRepository();