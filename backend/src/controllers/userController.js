const UserService = require('../services/UserService');
const userRepository = require('../repositories/UserRepository');
const commentRepository = require('../repositories/CommentRepository');
const newsRepository = require('../repositories/NewsRepository');
const User = require('../models/User');
const { UserResponseDTO } = require('../dto/user.dto');

const userService = new UserService(userRepository, commentRepository, newsRepository);

/**
 * @route   GET /api/users/me
 * @desc    Отримати дані поточного користувача та його збережені новини
 * @access  Private (Тільки з токеном)
 */
const getMe = async (req, res, next) => {
    try {
        const user = await userRepository.findByIdWithSavedNews(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        //delete user.password;
        const formattedUser = new UserResponseDTO(user);

        res.status(200).json({
            success: true,
            //data: user
            data: formattedUser
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;
        
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        
        let updateData = { username };

        if (req.file) {
            updateData.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: new UserResponseDTO(updatedUser) });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsersList(req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const user = await userService.updateUserRole(req.params.id, req.body.role);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { getMe, updateProfile, getUsers, updateUserRole, deleteUser };