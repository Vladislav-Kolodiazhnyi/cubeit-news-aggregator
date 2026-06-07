const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        trim: true,
        minlength: 1,
        maxlength: 1000
    },
    news: {
        type: Schema.Types.ObjectId,
        ref: 'News',
        required: true,
        index: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);