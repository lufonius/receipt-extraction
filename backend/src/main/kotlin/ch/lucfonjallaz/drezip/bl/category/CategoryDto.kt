package ch.lucfonjallaz.drezip.bl.category

data class CategoryDto(
    val id: Int,
    val avatarUrl: String,
    val color: Int,
    val name: String,
    val deleted: Boolean,
    val parentCategoryId: Int? = null,
    val subCategories: List<CategoryDto>? = null
)