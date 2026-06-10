const SITES_CONFIG = [
    {
        name: 'AIN',
        url: 'https://ain.ua/tech/', //page/3/
        limit: 11,
        container: 'article.widget',
        selectors: {
            link: 'a.widget__content',
            title: 'p.h2',
            description: ($el) => $el.find('p.h2').next('p').text().trim(),
            image: ($el) => $el.find('img').attr('data-src') || $el.find('img').attr('src'),
            date: ($el) => {
                const href = $el.find('a.widget__content').attr('href');
                if (!href) return '';
                const dateMatch = href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
                if (dateMatch) {
                    const [_, year, month, day] = dateMatch;
                    return `${year}-${month}-${day}`;
                }
                return '';
            }
        }
    },
    {
        name: 'ITC',
        url: 'https://itc.ua/ua/biznes-ua/',
        limit: 50,
        container: 'div.post',
        selectors: {
            link: 'h2.entry-title a',
            title: 'h2.entry-title a',
            description: 'div.entry-excerpt',
            image: ($el) => $el.find('div.col-img-in a').attr('data-bg'),
            date: ($el) => {
                const dateBlock = $el.find('span.date.part').clone();
                dateBlock.find('span').remove();
                const rawDateStr = dateBlock.text().trim();
                if (!rawDateStr) return '';
                const parts = rawDateStr.split('.');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return `${year}-${month}-${day}`;
                }
                return rawDateStr;
            }
        }
    },
    {
        name: 'ProIT',
        url: 'https://proit.ua/tag/news/', //page/2/
        limit: 21,
        container: 'div.site-post-card.news',
        selectors: {
            link: 'a.site-post-card-title',
            title: 'a.site-post-card-title',
            description: ($el) => {
                const block = $el.find('p.site-post-card-text').clone();
                block.find('br').replaceWith(' ');
                let text = block.text().trim();
                return text.replace(/\s\s+/g, ' ');
            },
            image: ($el) => $el.find('a.site-post-card-img img').attr('src'),
            date: ($el) => {
                const datetimeAttr = $el.find('.site-post-card-date time').attr('datetime');
                if (!datetimeAttr) return '';
                const parts = datetimeAttr.split('-');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    return `${year}-${month}-${day}`;
                }
                return datetimeAttr;
            }
        }
    }
];

module.exports = SITES_CONFIG;