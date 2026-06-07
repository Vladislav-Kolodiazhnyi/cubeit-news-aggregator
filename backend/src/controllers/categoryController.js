const CategoryService = require('../services/CategoryService');
const categoryRepository = require('../repositories/CategoryRepository');

const categoryService = new CategoryService(categoryRepository);

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Category with this name or slug already exists' });
        }
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const getAllCategoriesAdmin = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategoriesForAdmin();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, getAllCategoriesAdmin };