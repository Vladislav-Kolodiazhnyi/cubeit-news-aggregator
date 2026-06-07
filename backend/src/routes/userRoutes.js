const express = require('express');
const router = express.Router();
const { getMe, updateProfile, getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', protect, getMe);

router.patch('/me', protect, upload.single('avatar'), updateProfile);

router.get('/', protect, authorize('admin'), getUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;



