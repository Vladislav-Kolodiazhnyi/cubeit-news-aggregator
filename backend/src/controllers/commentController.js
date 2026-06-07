const CommentService = require('../services/CommentService');
const commentRepository = require('../repositories/CommentRepository');
const newsRepository = require('../repositories/NewsRepository');

const commentService = new CommentService(commentRepository, newsRepository);

/**
 * @route   GET /api/comments/news/:newsId
 * @desc    Отримати коментарі до новини
 * @access  Public
 */
const getComments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const comments = await commentService.getNewsComments(req.params.newsId, page);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/comments/news/:newsId
 * @desc    Додати коментар
 * @access  Private
 */
const addComment = async (req, res, next) => {
    try {
        if (!req.body.text) {
            return res.status(400).json({ success: false, message: 'Comment text is required' });
        }

        const comment = await commentService.addComment(
            req.params.newsId,
            req.user.id,
            req.body.text
        );

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /api/comments/:id
 * @desc    Видалити коментар
 * @access  Private (Автор або Адмін)
 */
const deleteComment = async (req, res, next) => {
    try {
        const result = await commentService.deleteComment(
            req.params.id,
            req.user.id,
            req.user.role
        );
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getComments, addComment, deleteComment };