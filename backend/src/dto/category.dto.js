class CategoryResponseDTO {
    constructor(category) {
        this.id = category._id.toString();
        this.name = category.name;
        this.slug = category.slug;
        this.description = category.description;
    }
}

module.exports = { CategoryResponseDTO };