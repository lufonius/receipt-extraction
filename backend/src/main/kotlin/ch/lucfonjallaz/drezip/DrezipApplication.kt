package ch.lucfonjallaz.drezip

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

@SpringBootApplication
@Import(SwaggerConfiguration::class, RequestLoggingConfiguration::class)
class Application

fun main(args: Array<String>) {
	runApplication<Application>(*args)
}
