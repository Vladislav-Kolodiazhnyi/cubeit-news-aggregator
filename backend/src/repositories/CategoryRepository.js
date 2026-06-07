const Category = require('../models/Category');

class CategoryRepository {
    
    async findAllActive() {
        return await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    }

    async findBySlug(slug) {
        return await Category.findOne({ slug, isActive: true }).lean();
    }

    async insertMany(categories) {
        return await Category.insertMany(categories, { ordered: false });
    }

    async count() {
        return await Category.countDocuments();
    }

    async findById(id) {
        return await Category.findById(id).lean();
    }

    async create(categoryData) {
        const category = new Category(categoryData);
        return await category.save();
    }

    async update(id, categoryData) {
        return await Category.findByIdAndUpdate(
            id,
            { $set: categoryData },
            { new: true, runValidators: true }
        ).lean();
    }

    async delete(id) {
        return await Category.findByIdAndDelete(id).lean();
    }

    async findAllForAdmin() {
        return await Category.find({}).sort({ name: 1 }).lean();
    }
}

module.exports = new CategoryRepository();