require('dotenv').config();
const cron = require('node-cron');
const connectDB = require('./config/db');
const runScraperPipeline = require('./workers/scraperWorker');
const processPendingNewsWithLLM = require('./workers/classifierWorker');

const startScheduler = async () => {
    try {
        await connectDB();
        console.log('[Scheduler] Планувальник завдань успішно запущено.');

        // cron.schedule('0 * * * *', async () => {
        //     console.log(`\n[Cron] Запуск парсера новин: ${new Date().toLocaleTimeString()}`);
        //     await runScraperPipeline();
        // });

        cron.schedule('*/2 * * * *', async () => {
            console.log(`\n[Cron] Запуск AI-обробки: ${new Date().toLocaleTimeString()}`);
            await processPendingNewsWithLLM();
        });

        // await runScraperPipeline();
        // await processPendingNewsWithLLM();

    } catch (error) {
        console.error('[Scheduler] Критична помилка запуску планувальника:', error.message);
        process.exit(1);
    }
};

startScheduler();