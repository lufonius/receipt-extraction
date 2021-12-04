package ch.lucfonjallaz.drezip.bl.category

import ch.lucfonjallaz.drezip.auth.UserDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource(exported = false)
interface CategoryRepository : JpaRepository<CategoryDbo, Int> {
    fun findByUser(userDbo: UserDbo): List<CategoryDbo>
}

// how to make an apache lucene in memory search
// dynamic queries jpa use cases
// spring application events
// how to handle timezones in applications
// why are enums bad?
// how to make rolling updates? maybe simulate a production deployment
// make local development as similar as possible to production
// mbean: adjust properties during runtime
// using providers for config values, store properties in the database
// feature toggle: https://martinfowler.com/bliki/FeatureToggle.html
// testing repositories with TestContainers and rollback functionality (rollback transaction?)
// how are exceptions mapped to status codes? custom exceptions?
// simple dto validation?
// data fixture -> do not insert if exists mysql https://stackoverflow.com/questions/1361340/how-to-insert-if-not-exists-in-mysql
// namedEntityGraph, solving the the n+1 issue
// logging hibernate performance https://www.baeldung.com/hibernate-common-performance-problems-in-logs (do not use this in production)
// logging and monitoring
// proxy design patter (try it out)
// git learning tool (exercise: do a rebase, do a force push, do a merge and rollback)
// exceptions
// security (sticky session, cross site request forgery?)
// what is cache invalidation?
// keeping the UI in sync with the backend -> server side events?