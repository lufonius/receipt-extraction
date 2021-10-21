package ch.lucfonjallaz.drezip.bl.category

import org.hibernate.Session
import org.springframework.data.repository.findByIdOrNull
import org.springframework.web.bind.annotation.*
import javax.persistence.EntityManager

@RestController
// TODO: make configurable on a per-environment basis
@CrossOrigin("*")
class CategoryController(
        val categoryMapper: CategoryMapper,
        val categoryRepository: CategoryRepository,
        val entityManager: EntityManager
) {
    @GetMapping("/category")
    fun getAll() = categoryMapper.mapFromDbos(categoryRepository.findAll())

    @DeleteMapping("/category/{id}")
    fun delete(@PathVariable id: Int) = categoryRepository.deleteById(id)

    @PutMapping("/category/{id}")
    fun update(@RequestBody categoryDto: CategoryDto, @PathVariable id: Int): CategoryDto {
        val foundDbo = categoryRepository.findByIdOrNull(id)

        if (foundDbo?.deleted == false) {
            val dbo = categoryMapper.mapFromDto(categoryDto)
            val dboWithExplicitId = dbo.copy(id = id)
            val updatedDbo = categoryRepository.save(dboWithExplicitId)

            return categoryMapper.mapFromDbo(updatedDbo)
        } else {
            throw Exception("Cannot update deleted entity")
        }
    }

    @PostMapping("/category")
    fun insert(@RequestBody dto: CategoryDto): CategoryDto {
        val insertedDbo = categoryRepository.save(categoryMapper.mapFromDto(dto))
        return categoryMapper.mapFromDbo(insertedDbo)
    }
}