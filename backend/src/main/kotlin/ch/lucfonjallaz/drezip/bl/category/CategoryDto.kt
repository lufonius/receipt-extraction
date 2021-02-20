package ch.lucfonjallaz.drezip.bl.category

data class CategoryDto(
    val id: Int,
    val avatarUrl: String,
    val color: String,
    val name: String,
    val subCategories: List<CategoryDto>? = null
)