const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory, getAllCategoriesAdmin } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getCategories);

router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

router.get('/all', protect, authorize('admin'), getAllCategoriesAdmin);

module.exports = router;
