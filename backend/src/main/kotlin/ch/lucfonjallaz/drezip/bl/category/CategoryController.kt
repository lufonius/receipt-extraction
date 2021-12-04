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
        val categoryService: CategoryService
) {
    @GetMapping("/category")
    fun getAll(@User user: UserDbo): List<CategoryDto> {
        return categoryMapper.mapFromDbos(categoryService.findAllByUser(user))
    }

    @DeleteMapping("/category/{id}")
    fun delete(@PathVariable id: Int, @User userDbo: UserDbo) = categoryService.delete(id, userDbo)

    @PutMapping("/category/{id}")
    fun update(@RequestBody categoryDto: CategoryDto, @PathVariable id: Int, @User userDbo: UserDbo): CategoryDto {
        val dbo = categoryMapper.mapFromDto(categoryDto, userDbo)
        val updatedDbo = categoryService.update(id, dbo, userDbo)

        return categoryMapper.mapFromDbo(updatedDbo)
    }

    @PostMapping("/category")
    fun insert(@RequestBody dto: CategoryDto, @User userDbo: UserDbo): CategoryDto {
        val dbo = categoryMapper.mapFromDto(dto, userDbo)
        val insertedDbo = categoryService.insert(dbo)
        return categoryMapper.mapFromDbo(insertedDbo)
    }
}