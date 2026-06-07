const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserResponseDTO } = require('../dto/user.dto');

class AuthService {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    generateToken(userId, role) {
        return jwt.sign(
            { id: userId, role: role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    async register({ username, email, password }) {
        const existingEmail = await this.userRepository.findByEmail(email);
        if (existingEmail) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        const existingUsername = await this.userRepository.findByUsername(username);
        if (existingUsername) {
            const error = new Error('Username is taken');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await this.userRepository.create({
            username,
            email,
            password: hashedPassword
        });

        const token = this.generateToken(user._id, user.role);

        return {
            user: new UserResponseDTO(user),
            token
        };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmailWithPassword(email);
        
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        
        const token = this.generateToken(user._id, user.role);

        return {
            user: new UserResponseDTO(user),
            token
        };
    }
}

module.exports = AuthService;