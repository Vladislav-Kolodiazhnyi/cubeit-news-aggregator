const { GoogleGenAI } = require('@google/genai');

class AiService {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    async analyzeNews(title, description, availableCategories) {
        const categoryNames = availableCategories.map(c => c.name).join(', ');

        const prompt = `
        Ти — головний редактор новинного порталу. Твоє завдання: проаналізувати заголовок та опис новини, щоб визначити її найрелевантнішу категорію та підібрати влучні теги.
            
        ВХІДНІ ДАНІ:
        Заголовок: "${title}"
        Опис: "${description}"
            
        ДОСТУПНІ КАТЕГОРІЇ: 
        [${categoryNames}]
            
        ІНСТРУКЦІЇ:
        1. Категорія: Обери строго ОДНУ категорію виключно з наданого списку. Ти не маєш права вигадувати нові категорії. Якщо жодна категорія не підходить ідеально, обери найбільш близьку за змістом.
        2. Теги: Згенеруй масив з 3-5 ключових слів або коротких фраз.
           - Загальні поняття мають бути написані українською мовою, з маленької літери, у називному відмінку (наприклад: "технології", "інвестиції").
           - Власні назви міжнародних компаній, брендів, продуктів чи технологій залишай мовою оригіналу без перекладу чи транслітерації (наприклад: "Apple", "Google", "ChatGPT").
           - Використовуй конкретні сутності (імена, локації, явища), уникай занадто загальних слів ("новина", "сьогодні", "стаття").
            
        ФОРМАТ ВИВОДУ:
        Поверни ВИКЛЮЧНО сирий та валідний JSON. Не додавай жодного вступного тексту, пояснень чи markdown-форматування (не використовуй блоки \`\`\`json).
            
        Очікувана структура JSON:
        {
          "category": "Назва обраної категорії",
          "tags": ["тег1", "тег2", "тег3"]
        }
        `;

        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-3.1-flash-lite', // gemini-2.5-flash // gemini-3-flash-preview // gemini-3.1-flash-lite
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                }
            });

            const result = JSON.parse(response.text);
            return result;
        } catch (error) {
            console.error('[AI Service] Помилка генерації або парсингу JSON:', error.message);
            throw error;
        }
    }
}

module.exports = new AiService();