const User = require('../models/User');

class UserRepository {

    async findByEmailWithPassword(email) {
        return await User.findOne({ email }).select('+password').lean();
    }

    async findByEmail(email) {
        return await User.findOne({ email }).lean();
    }

    async findByUsername(username) {
        return await User.findOne({ username }).lean();
    }

    async findById(id) {
        return await User.findById(id).lean();
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async toggleSavedNews(userId, newsId) {
        const user = await User.findById(userId);
        if (!user) return null;

        const isSaved = user.savedNews.includes(newsId);
        
        if (isSaved) {
            user.savedNews.pull(newsId);
        } else {
            user.savedNews.push(newsId);
        }

        await user.save();
        return { isSaved: !isSaved, user };
    }

    // async findByIdWithSavedNews(id) {
    //     return await User.findById(id)
    //         .populate({
    //             path: 'savedNews',
    //             select: 'title description sourceLink image source category tags createdAt'
    //         })
    //         .lean();
    // }
    
    async findByIdWithSavedNews(id) {
        return await User.findById(id)
            .populate({
                path: 'savedNews',
                populate: { 
                    path: 'category',
                    select: 'name slug'
                }
            })
            .lean();
    }
    
    async removeNewsFromAllSaved(newsId) {
        return await User.updateMany(
            {},
            { $pull: { savedNews: newsId } }
        );
    }

    async findAll({ skip = 0, limit = 10 }) {
        const [data, total] = await Promise.all([
            User.find({})
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments()
        ]);
        return { data, total };
    }

    async updateRole(id, role) {
        return await User.findByIdAndUpdate(
            id, 
            { $set: { role } }, 
            { new: true, runValidators: true }
        ).select('-password').lean();
    }
    
    async delete(id) {
        return await User.findByIdAndDelete(id).lean();
    }
}

module.exports = new UserRepository();