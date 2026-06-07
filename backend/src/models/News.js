const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    sourceLink: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        required: true,
        index: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        default: null 
    },
    tags: [{
        type: String,
        trim: true
    }],
    viewsCount: {
        type: Number,
        default: 0
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    aiStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    parsedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

newsSchema.index({ createdAt: -1 });

newsSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('News', newsSchema);