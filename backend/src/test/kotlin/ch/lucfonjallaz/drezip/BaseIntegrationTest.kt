package ch.lucfonjallaz.drezip
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
abstract class BaseIntegrationTest {
    @LocalServerPort val port: Int = 67988

    val apiBaseUrl: String
            get() = "http://localhost:$port"
}