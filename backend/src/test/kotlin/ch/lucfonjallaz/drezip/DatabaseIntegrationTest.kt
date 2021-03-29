package ch.lucfonjallaz.drezip

import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

// this is just some helper class so that we can use the fluent api. Otherwise the "SELF" generic
// of the MySQLContainer hinders us doing that
class DatabaseContainer : MySQLContainer<DatabaseContainer>("mysql:8.0") {}

@Testcontainers
class DatabaseIntegrationTest : BaseIntegrationTest() {
    companion object {
        @Container
        val mySqlContainer = DatabaseContainer()
                .withDatabaseName("test")
                .withUsername("test")
                .withPassword("test")
    }
}