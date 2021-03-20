package ch.lucfonjallaz.drezip.bl.category

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
// TODO: make configurable on a per-environment basis
@CrossOrigin("*")
class CategoryController(
        val categoryMapper: CategoryMapper,
        val categoryRepository: CategoryRepository
) {
    @GetMapping("/category")
    fun getAll() = categoryMapper.mapFromDbos(categoryRepository.findAll())
}