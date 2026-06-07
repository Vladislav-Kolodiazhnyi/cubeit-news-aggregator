const { CategoryResponseDTO } = require('../dto/category.dto');

class CategoryService {
    
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async getAllCategories() {
        const categories = await this.categoryRepository.findAllActive();

        return categories.map(cat => new CategoryResponseDTO(cat));
    }

    async createCategory(data) {
        let slug = data.slug;
        if (!slug) {
            slug = data.name.toLowerCase().replace(/\s+/g, '-');
        }

        const category = await this.categoryRepository.create({
            ...data,
            slug
        });

        return new CategoryResponseDTO(category);
    }

    async updateCategory(id, data) {
        const category = await this.categoryRepository.update(id, data);
        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }
        return new CategoryResponseDTO(category);
    }

    async deleteCategory(id) {
        const category = await this.categoryRepository.delete(id);
        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }
        return { message: 'Category successfully deleted' };
    }
    
    async getAllCategoriesForAdmin() {
        return await this.categoryRepository.findAllForAdmin();
    }
}

module.exports = CategoryService;