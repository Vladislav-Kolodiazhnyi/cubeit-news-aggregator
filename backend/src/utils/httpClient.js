const axios = require('axios');

const httpClient = axios.create({
    timeout: 10000,
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    }
});

module.exports = httpClient;