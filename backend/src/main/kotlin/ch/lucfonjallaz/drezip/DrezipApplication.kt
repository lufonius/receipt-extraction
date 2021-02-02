package ch.lucfonjallaz.drezip

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

@SpringBootApplication
@Import(SwaggerConfiguration::class)
class DrezipApplication

fun main(args: Array<String>) {
	runApplication<DrezipApplication>(*args)
}
