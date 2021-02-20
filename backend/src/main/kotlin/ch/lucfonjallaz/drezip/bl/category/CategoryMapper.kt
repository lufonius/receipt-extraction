package ch.lucfonjallaz.drezip.bl.category

import org.springframework.stereotype.Component

@Component
class CategoryMapper {
    fun mapFromDbos(dbos: List<CategoryDbo>) = dbos.map { mapFromDbo(it) }

    fun mapFromDbo(dbo: CategoryDbo): CategoryDto {
        return CategoryDto(
                id = dbo.id,
                avatarUrl = dbo.avatarUrl,
                color = dbo.color,
                name = dbo.name,
                subCategories = dbo.subCategories?.map { mapFromDbo(it) }
        )
    }
}