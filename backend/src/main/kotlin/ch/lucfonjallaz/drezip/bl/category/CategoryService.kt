package ch.lucfonjallaz.drezip.bl.category

import ch.lucfonjallaz.drezip.auth.UserDbo
import org.springframework.stereotype.Component
import javax.persistence.EntityNotFoundException

@Component
class CategoryService(
    val categoryRepository: CategoryRepository
) {
    fun findAllByUser(user: UserDbo): List<CategoryDbo> = categoryRepository.findByUser(user)

    fun update(id: Int, updateTo: CategoryDbo, userDbo: UserDbo): CategoryDbo {
        val foundDbo = categoryRepository.getByIdAndUser(id, userDbo)

        if (!foundDbo.deleted) {
            val dboWithExplicitId = updateTo.copy(id = id)
            return categoryRepository.save(dboWithExplicitId)
        } else {
            throw EntityNotFoundException()
        }
    }

    fun insert(toInsert: CategoryDbo) = categoryRepository.save(toInsert)

    fun delete(id: Int, userDbo: UserDbo) {
        val foundDbo = categoryRepository.getByIdAndUser(id, userDbo)

        if (!foundDbo.deleted) {
            categoryRepository.deleteById(id)
        } else {
            throw EntityNotFoundException()
        }
    }
}