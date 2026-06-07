const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/news/:newsId', getComments);

router.post('/news/:newsId', protect, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;