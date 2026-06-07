const SITES_CONFIG = [
    {
        name: 'AIN',
        url: 'https://ain.ua/tech/',
        category: 'Technologies',
        container: 'main article.widget',
        selectors: {
            link: 'a.widget__content',
            title: 'p.h2',
            description: ($el) => $el.find('p.h2').next('p').text().trim(),
            image: ($el) => $el.find('img').attr('data-src') || $el.find('img').attr('src')
        }
    },
    {
        name: 'ITC',
        url: 'https://itc.ua/ua/biznes-ua/',
        category: 'Business',
        container: '#content .post',
        selectors: {
            link: '.entry-title a',
            title: '.entry-title a',
            description: '.entry-excerpt',
            image: ($el) => $el.find('.col-img-in a').attr('data-bg')
        }
    },
    {
        name: 'ProIT',
        url: 'https://proit.ua/tag/news/',
        category: 'Hardware',
        container: '.site-post-card.news',
        selectors: {
            link: '.site-post-card-title',
            title: '.site-post-card-title',
            //description: '.site-post-card-text',

            description: ($el) => {
                const block = $el.find('.site-post-card-text').clone();
                block.find('br').replaceWith(' ');
                let text = block.text().trim();
                return text.replace(/\s\s+/g, ' ');
            },

            image: ($el) => $el.find('.site-post-card-img img').attr('src')
        }
    }
];

module.exports = SITES_CONFIG;