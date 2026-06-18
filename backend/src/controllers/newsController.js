const NewsService = require('../services/NewsService');
const newsRepository = require('../repositories/NewsRepository');
const categoryRepository = require('../repositories/CategoryRepository');
const commentRepository = require('../repositories/CommentRepository');
const userRepository = require('../repositories/UserRepository');

const newsService = new NewsService(newsRepository, categoryRepository, commentRepository, userRepository);

/**
 * @route   GET /api/news
 * @desc    Отримати список новин (враховуючи права доступу)
 * @access  Public / Admin
 */
const getNews = async (req, res, next) => {
    try {
        const queryParams = { ...req.query };

        if (queryParams.isAdmin === 'true' || queryParams.isAdmin === true) {
            const isUserAdmin = req.user && req.user.role === 'admin';

            if (!isUserAdmin) {
                queryParams.isAdmin = false;
            }
        }

        const result = await newsService.getNewsList(queryParams);

        res.status(200).json({
            success: true,
            data: result.news,
            meta: result.meta
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/news/:id
 * @desc    Отримати одну новину за ID
 * @access  Public
 */
const getNewsById = async (req, res, next) => {
    try {
        const news = await newsService.getNewsById(req.params.id);

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({ success: false, message: error.message });
        }
        next(error);
    }
};

/**
 * @route   POST /api/news/:id/like
 * @desc    Поставити/прибрати лайк
 * @access  Private (Тільки з токеном)
 */
const toggleLike = async (req, res, next) => {
    try {
        const result = await newsService.toggleLike(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/news/:id/save
 * @desc    Зберегти/видалити з закладок
 * @access  Private (Тільки з токеном)
 */
const toggleSave = async (req, res, next) => {
    try {
        const result = await userRepository.toggleSavedNews(req.user.id, req.params.id);

        res.status(200).json({
            success: true,
            data: { isSaved: result.isSaved }
        });
    } catch (error) {
        next(error);
    }
};

const createNews = async (req, res, next) => {
    try {
        const news = await newsService.createNews(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

const updateNews = async (req, res, next) => {
    try {
        const news = await newsService.updateNews(req.params.id, req.body);
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

const deleteNews = async (req, res, next) => {
    try {
        const result = await newsService.deleteNews(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getSources = async (req, res, next) => {
    try {
        const sources = await newsService.getSourcesList();
        res.status(200).json({
            success: true,
            data: sources
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNews,
    getNewsById,
    toggleLike,
    toggleSave,
    createNews,
    updateNews,
    deleteNews,
    getSources
};