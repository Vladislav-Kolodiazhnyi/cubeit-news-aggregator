const scraperService = require('../services/ScraperService');
const newsRepository = require('../repositories/NewsRepository');
const SITES_CONFIG = require('../config/sites');

const runScraperPipeline = async () => {
    console.log('[Worker] Старт швидкого збору новин...');
    try {
        const results = await Promise.all(SITES_CONFIG.map(config => scraperService.scrapeSite(config)));
        const allNews = results.flat();

        if (allNews.length > 0) {
            await newsRepository.insertMany(allNews);
            console.log(`[DB] Збережено ${allNews.length} новин у статусі 'pending'`);
        } else {
            console.log('[Worker] Нових новин для збереження не знайдено.');
        }
    } catch (error) {
        if (error.code !== 11000) {
            console.error('[Worker] Помилка у scraper pipeline:', error.message);
        }
    }
    console.log('[Worker] Збір завершено.');
};

module.exports = runScraperPipeline;