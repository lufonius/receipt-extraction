package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import kotlin.reflect.KClass

@Component
class HttpRequestService(val restTemplateBuilder: RestTemplateBuilder) {
    fun <T, R: Any> post(url: String, body: T, headers: HttpHeaders, returnType: KClass<R>): ResponseEntity<R> {
        val restTemplate = restTemplateBuilder.build()

        val entity = HttpEntity(body, headers)

        return restTemplate.exchange(url, HttpMethod.POST, entity, returnType.java)
    }

    fun <R: Any> get(url: String, headers: HttpHeaders, returnType: KClass<R>): ResponseEntity<R> {
        val restTemplate = restTemplateBuilder.build()

        val entity = HttpEntity<HttpHeaders>(headers)

        return restTemplate.exchange(url, HttpMethod.GET, entity, returnType.java)
    }
}