package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.mocks.MockConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

// separate test app so that we do not clutter the productive code with
// conditional activation of mocks depending on the profile
// also, the productive JAR does not contain test / local code
@SpringBootApplication
@Import(
	SwaggerConfiguration::class,
	RequestLoggingConfiguration::class,
	SecurityConfiguration::class,
	MockConfiguration::class
)
class TestDrezipApplication {
	companion object {
		@JvmStatic
		fun main(args: Array<String>) {
			runApplication<Application>(*args)
		}
	}
}
