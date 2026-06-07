const News = require('../models/News');
const User = require('../models/User');
const Category = require('../models/Category');
const runScraperPipeline = require('../workers/scraperWorker');

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalNews,
            pendingNews,
            failedNews,
            totalUsers,
            totalCategories
        ] = await Promise.all([
            News.countDocuments(),
            News.countDocuments({ aiStatus: 'pending' }),
            News.countDocuments({ aiStatus: 'failed' }),
            User.countDocuments(),
            Category.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                news: { total: totalNews, pending: pendingNews, failed: failedNews },
                users: { total: totalUsers },
                categories: { total: totalCategories }
            }
        });
    } catch (error) {
        next(error);
    }
};

const triggerParsing = async (req, res, next) => {
    try {
        console.log(`[Admin] Parsing triggered by user: ${req.user.id}`);
        
        await runScraperPipeline();
        
        res.status(200).json({
            success: true,
            message: 'Scraper executed successfully. Feed has been updated!'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats, triggerParsing };