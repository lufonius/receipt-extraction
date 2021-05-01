package ch.lucfonjallaz.drezip
import org.junit.jupiter.api.BeforeAll
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
abstract class BaseIntegrationTest {
    @LocalServerPort val port: Int = 67988

    val apiBaseUrl: String
            get() = "http://localhost:$port"

    companion object {

        val mySqlContainer = CustomMySqlContainer().apply {
            withDatabaseName("test")
            withUsername("test")
            withPassword("test")
            withReuse(true)
        }

        init {
            mySqlContainer.start()
        }
    }
}