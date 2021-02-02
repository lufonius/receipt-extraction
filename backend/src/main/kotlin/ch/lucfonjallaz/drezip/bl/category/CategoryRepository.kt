package ch.lucfonjallaz.drezip.bl.category

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface CategoryRepository : JpaRepository<CategoryDbo, Int>

// how to make an apache lucene in memory search
// dynamic queries jpa use cases
// spring application events
// how to handle timezones in applications