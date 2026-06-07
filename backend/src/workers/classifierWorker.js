const newsRepository = require('../repositories/NewsRepository');
const categoryRepository = require('../repositories/CategoryRepository');
const aiService = require('../services/AiService');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const processPendingNewsWithLLM = async () => {
    console.log('[Job] Старт класифікації новин через AI...');

    try {
        const pendingNews = await newsRepository.getPendingNews(15);

        if (pendingNews.length === 0) {
            console.log('[Job] Немає новин для AI обробки.');
            return;
        }

        console.log(`[Job] Оброблюємо ${pendingNews.length} новин...`);
        const categories = await categoryRepository.findAllActive();

        for (const news of pendingNews) {
            try {
                console.log(`[AI] Аналізую: "${news.title.substring(0, 40)}..."`);

                const aiData = await aiService.analyzeNews(news.title, news.description, categories);

                const matchedCategory = categories.find(
                    cat => cat.name.toLowerCase() === aiData.category.toLowerCase()
                );

                const categoryNameForLogs = aiData.category; 

                if (matchedCategory) {
                    aiData.category = matchedCategory._id; 
                } else {
                    console.warn(`[AI] Категорію "${aiData.category}" не знайдено в БД. Ставимо null.`);
                    aiData.category = null; 
                }
                
                await newsRepository.updateAIResult(news._id, aiData);
                console.log(`[AI] Успішно. Категорія: [${categoryNameForLogs}], Теги: ${aiData.tags.join(', ')}`);

                await delay(2000);

            } catch (error) {
                console.error(`[AI] Помилка обробки новини ID ${news._id}:`, error.message);
                await newsRepository.markAsFailed(news._id);
            }
        }
    } catch (globalError) {
        console.error('[Job] Глобальна помилка у classifier pipeline:', globalError.message);
    }
    console.log('[Job] AI обробку завершено.\n');
};

module.exports = processPendingNewsWithLLM;