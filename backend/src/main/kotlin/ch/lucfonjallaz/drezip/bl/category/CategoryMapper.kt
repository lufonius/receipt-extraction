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
                deleted = dbo.deleted,
                subCategories = dbo.subCategories?.map { mapFromDbo(it) }
        )
    }

    fun mapFromDto(dto: CategoryDto): CategoryDbo {
        return CategoryDbo(
                id = dto.id,
                avatarUrl = dto.avatarUrl,
                color = dto.color,
                name = dto.name,
                parentCategoryId = dto.parentCategoryId,
                subCategories = dto.subCategories?.map { it -> mapFromDto(it) }
        )
    }
}