package ch.lucfonjallaz.drezip

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
abstract class BaseIntegrationTest {
    @LocalServerPort val port: Int = 8080

    companion object {
        @Container
        val mySqlContainer = MySQLContainer<Nothing>("mysql:8.0")

        @DynamicPropertySource
        @JvmStatic
        fun register(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { mySqlContainer.jdbcUrl }
            registry.add("spring.datasource.username") { mySqlContainer.username }
            registry.add("spring.datasource.password") { mySqlContainer.password }
        }
    }
}