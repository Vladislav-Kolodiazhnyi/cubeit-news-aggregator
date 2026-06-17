const cheerio = require('cheerio');
const httpClient = require('../utils/httpClient');

class ScraperService {
    async scrapeSite(config) {
        try {
            console.log(`[Scraper] Парсинг ${config.name} (ліміт: ${config.limit || 10})...`);
            const { data } = await httpClient.get(config.url);
            const $ = cheerio.load(data);
            const newsList = [];

            const itemLimit = config.limit || 10;

            $(config.container).slice(0, itemLimit).each((_, element) => {
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

                let rawDate = '';
                if (config.selectors.date) {
                    if (typeof config.selectors.date === 'function') {
                        rawDate = config.selectors.date($el);
                    } else {
                        rawDate = $el.find(config.selectors.date).text().trim();
                    }
                }

                let parsedDate = new Date();
                if (rawDate) {
                    const dateCandidate = new Date(rawDate);
                    if (!isNaN(dateCandidate.getTime())) {
                        parsedDate = dateCandidate;
                    }
                }

                if (title && sourceLink) {
                    newsList.push({
                        title,
                        sourceLink,
                        image: image || '',
                        description,
                        source: config.name,
                        createdAt: parsedDate
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