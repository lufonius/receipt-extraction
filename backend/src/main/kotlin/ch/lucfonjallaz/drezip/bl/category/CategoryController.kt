package ch.lucfonjallaz.drezip.bl.category

import ch.lucfonjallaz.drezip.auth.User
import ch.lucfonjallaz.drezip.auth.UserDbo
import org.springframework.data.repository.findByIdOrNull
import org.springframework.web.bind.annotation.*
import javax.persistence.EntityManager

@RestController
// TODO: make configurable on a per-environment basis
@CrossOrigin("*")
class CategoryController(
        val categoryMapper: CategoryMapper,
        val categoryRepository: CategoryRepository
) {
    @GetMapping("/category")
    fun getAll(@User user: UserDbo): List<CategoryDto> {
        return categoryMapper.mapFromDbos(categoryRepository.findByUser(user))
    }

    @DeleteMapping("/category/{id}")
    fun delete(@PathVariable id: Int) = categoryRepository.deleteById(id)

    @PutMapping("/category/{id}")
    fun update(@RequestBody categoryDto: CategoryDto, @PathVariable id: Int, @User userDbo: UserDbo): CategoryDto {
        val foundDbo = categoryRepository.findByIdOrNull(id)

        if (foundDbo?.deleted == false) {
            val dbo = categoryMapper.mapFromDto(categoryDto, userDbo)
            val dboWithExplicitId = dbo.copy(id = id)
            val updatedDbo = categoryRepository.save(dboWithExplicitId)

            return categoryMapper.mapFromDbo(updatedDbo)
        } else {
            throw Exception("Cannot update deleted entity")
        }
    }

    @PostMapping("/category")
    fun insert(@RequestBody dto: CategoryDto, @User userDbo: UserDbo): CategoryDto {
        val insertedDbo = categoryRepository.save(categoryMapper.mapFromDto(dto, userDbo))
        return categoryMapper.mapFromDbo(insertedDbo)
    }
}