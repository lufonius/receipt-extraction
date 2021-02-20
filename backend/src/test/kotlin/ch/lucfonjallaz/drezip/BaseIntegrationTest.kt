package ch.lucfonjallaz.drezip

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

class DatabaseContainer : MySQLContainer<DatabaseContainer>("mysql:8.0") {}

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
abstract class BaseIntegrationTest {
    @LocalServerPort val port: Int = 8080

    val apiBaseUrl: String
            get() = "http://localhost:$port"

    companion object {
        @Container
        val mySqlContainer = DatabaseContainer()
                .withDatabaseName("test")
                .withUsername("test")
                .withPassword("test")

        private val logger: Logger = LoggerFactory.getLogger(BaseIntegrationTest::class.java)

        @DynamicPropertySource
        @JvmStatic
        fun register(registry: DynamicPropertyRegistry) {
            logger.debug("starting database container accessible with jdbc url: ${mySqlContainer.jdbcUrl}")
            registry.add("spring.datasource.url") { mySqlContainer.jdbcUrl }
            registry.add("spring.datasource.username") { mySqlContainer.username }
            registry.add("spring.datasource.password") { mySqlContainer.password }
        }
    }
}