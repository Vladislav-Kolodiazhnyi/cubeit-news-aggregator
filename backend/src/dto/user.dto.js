const { NewsResponseDTO } = require('./news.dto');

class UserResponseDTO {
    constructor(user) {
        //this.id = user._id;
        this.id = user._id.toString();
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
        
        if (user.savedNews && user.savedNews.length > 0) {
            this.savedNews = typeof user.savedNews[0] === 'object' 
                ? user.savedNews.map(news => new NewsResponseDTO(news))
                : user.savedNews;
        } else {
            this.savedNews = [];
        }
    }
}

module.exports = { UserResponseDTO };