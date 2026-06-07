const cheerio = require('cheerio');
const httpClient = require('../utils/httpClient');

class ScraperService {
    async scrapeSite(config) {
        try {
            console.log(`[Scraper] Парсинг ${config.name}...`);
            const { data } = await httpClient.get(config.url);
            const $ = cheerio.load(data);
            const newsList = [];

            $(config.container).slice(0, 10).each((_, element) => {
                const $el = $(element);
                const linkSelector = config.selectors.link;
                const linkNode = typeof linkSelector === 'function' ? linkSelector($el) : $el.find(linkSelector);
                
                let rawLink = linkNode.attr('href');
                let sourceLink = rawLink;
                if (rawLink && rawLink.startsWith('/')) {
                    const origin = new URL(config.url).origin;
                    sourceLink = `${origin}${rawLink}`;
                }

                const title = $el.find(config.selectors.title).text().trim();

                let description = '';
                if (typeof config.selectors.description === 'function') {
                    description = config.selectors.description($el);
                } else {
                    description = $el.find(config.selectors.description).text().trim();
                }

                let image = '';
                if (typeof config.selectors.image === 'function') {
                    image = config.selectors.image($el);
                } else {
                    image = $el.find(config.selectors.image).attr('src');
                }

                if (title && sourceLink) {
                    newsList.push({
                        title,
                        sourceLink,
                        image: image || '',
                        description,
                        source: config.name,
                    });
                }
            });
            return newsList;
        } catch (error) {
            console.error(`[Scraper Service] Помилка ${config.name}:`, error.message);
            return [];
        }
    }
}

module.exports = new ScraperService();