package ch.lucfonjallaz.drezip.bl.category

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class CategoryController(
        val categoryMapper: CategoryMapper,
        val categoryRepository: CategoryRepository
) {
    @GetMapping("/category")
    fun getAll() = categoryMapper.mapFromDbos(categoryRepository.findAll())
}