class UserService {
    constructor(userRepository, commentRepository, newsRepository) {
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.newsRepository = newsRepository;
    }

    async getUsersList(queryParams) {
        const page = Math.max(1, parseInt(queryParams.page) || 1);
        const limit = Math.min(50, parseInt(queryParams.limit) || 10);
        const skip = (page - 1) * limit;

        const { data, total } = await this.userRepository.findAll({ skip, limit });

        return {
            users: data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }

    async updateUserRole(id, role) {
        if (!['user', 'admin'].includes(role)) {
            const error = new Error('Invalid role specified');
            error.statusCode = 400;
            throw error;
        }

        const updatedUser = await this.userRepository.updateRole(id, role);
        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return updatedUser;
    }

    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const commentCounts = await this.commentRepository.getCommentCountsByUserId(id);

        const decrementPromises = commentCounts.map(item => 
            this.newsRepository.updateCommentsCount(item._id, -item.count)
        );
        await Promise.all(decrementPromises);

        await Promise.all([
            this.commentRepository.deleteManyByUserId(id),
            this.newsRepository.removeUserFromAllLikesAndSaves(id)
        ]);
        
        await this.userRepository.delete(id);

        return { message: 'User and all related data successfully deleted' };
    }
}

module.exports = UserService;