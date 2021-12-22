package ch.lucfonjallaz.drezip
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.ActiveProfiles
import org.testcontainers.containers.GenericContainer
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
abstract class BaseAppTest {
    @LocalServerPort val port: Int = 67988

    val apiBaseUrl: String
            get() = "http://localhost:$port"

    companion object {

        // when using withReuse, the container cannot be used with the @Containers annotation
        // we have to start the container manually
        val mySqlContainer = CustomMySqlContainer().apply {
            withDatabaseName("test")
            withUsername("test")
            withPassword("test")
            // important line! with this, the container is reused accross integration tests
            // this makes them much faster!
            withReuse(true)
        }

        val azureite = GenericContainer<Nothing>("mcr.microsoft.com/azure-storage/azurite").apply {
            withExposedPorts(10000)
            withEnv("AZURITE_ACCOUNTS", "drezip:z8A+QnfibR5m1ZBOM7t8/FAG8556FpAIgiRXmKqmWz43JoIb0kbzW66/rO1HV+TZzeTFWBM9f1QsJduSeCxuSw==")
            withReuse(true)
        }

        init {
            mySqlContainer.start()
            azureite.start()
        }
    }
}