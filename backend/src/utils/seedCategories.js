const categoryRepository = require('../repositories/CategoryRepository');

const defaultCategories = [
    { 
        name: 'Гаджети', 
        slug: 'gadgets', 
        description: 'Огляди смартфонів, комп\'ютерів, комплектуючих, периферії та інших розумних пристроїв.' 
    },
    { 
        name: 'Бізнес', 
        slug: 'business', 
        description: 'IT-ринок, стартапи, інвестиції, фінанси технологічних компаній, злиття та кар\'єра в IT.' 
    },
    { 
        name: 'Штучний інтелект', 
        slug: 'ai', 
        description: 'Нейромережі, машинне навчання, мовні моделі (LLM), ШІ-сервіси та їхній вплив на суспільство.' 
    },
    { 
        name: 'Софт',
        slug: 'software', 
        description: 'Операційні системи, мобільні застосунки, вебсервіси, оновлення програм та інструменти для розробників.' 
    },
    { 
        name: 'Кібербезпека', 
        slug: 'cybersecurity', 
        description: 'Захист даних, хакерські атаки, витоки інформації, вразливості систем та кібервійна.' 
    },
    { 
        name: 'Ігри', 
        slug: 'games', 
        description: 'Анонси та огляди відеоігор, новини ігрової індустрії, кіберспорт та гральні консолі.' 
    },
    { 
        name: 'Технології', 
        slug: 'technologies', 
        description: 'Інтернет, телеком, зв\'язок, блокчейн, робототехніка та загальні інновації, що не увійшли в інші розділи.' 
    },
    { 
        name: 'Наука', 
        slug: 'science', 
        description: 'Космонавтика (наприклад, SpaceX, NASA), астрономія, фізика, біотехнології та фундаментальні дослідження.' 
    }
];

const seedCategories = async () => {
    try {
        const count = await categoryRepository.count();
        
        if (count === 0) {
            console.log('[Seeder] Категорії не знайдені. Створюємо базовий набір...');
            await categoryRepository.insertMany(defaultCategories);
            console.log('[Seeder] Базові категорії успішно додані в базу!');
        } else {
            console.log(`[Seeder] В базі вже є ${count} категорій. Пропускаємо створення.`);
        }
    } catch (error) {
        if (error.code === 11000) {
            console.log('[Seeder] Категорії вже існують.');
        } else {
            console.error('[Seeder] Помилка при створенні категорій:', error.message);
        }
    }
};

module.exports = seedCategories;