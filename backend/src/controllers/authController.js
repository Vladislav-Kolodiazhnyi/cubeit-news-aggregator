const AuthService = require('../services/AuthService');
const userRepository = require('../repositories/UserRepository');

const authService = new AuthService(userRepository);

/**
 * @route   POST /api/auth/register
 * @desc    Реєстрація користувача
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const result = await authService.register({ username, email, password });

        res.status(201).json({
            success: true,
            data: result.user,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Вхід (Логін)
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            data: result.user,
            token: result.token
        });
    } catch (error) {
        if (error.statusCode === 401) {
            return res.status(401).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = { register, login };