const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsById,
    toggleLike,
    toggleSave,
    createNews,
    updateNews,
    deleteNews,
    getSources
} = require('../controllers/newsController');

const { protect, authorize, optionalProtect } = require('../middlewares/authMiddleware');

router.get('/', optionalProtect, getNews);
router.get('/sources', getSources);
router.get('/:id', getNewsById);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/save', protect, toggleSave);

router.post('/', protect, authorize('admin'), createNews);
router.put('/:id', protect, authorize('admin'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;