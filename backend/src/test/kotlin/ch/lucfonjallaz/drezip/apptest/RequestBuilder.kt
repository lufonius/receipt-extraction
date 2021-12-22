package ch.lucfonjallaz.drezip.apptest

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.http.RequestEntity
import java.net.URI

data class RequestBuilder(val basePath: String) {
    private val headers = HttpHeaders()
    private var method: HttpMethod? = null
    private var body: Any? = null
    private var path: String? = null

    init { headers.contentType = MediaType.APPLICATION_JSON }

    fun setMediaType(mediaType: MediaType): RequestBuilder {
        headers.contentType = mediaType
        return this
    }

    fun makeRequestUserAware(user: TestUser): RequestBuilder {
        headers.set("Cookie", user.cookie)
        return this
    }

    fun setMethod(method: HttpMethod): RequestBuilder {
        this.method = method
        return this
    }

    fun setBody(body: Any): RequestBuilder {
        this.body = body
        return this
    }

    fun setPath(path: String): RequestBuilder {
        this.path = path
        return this
    }

    fun buildRequest(): RequestEntity<Any> {
        if (method == null || path == null) {
            throw RuntimeException("Not all needed properties have been set")
        }

        return if (body == null) {
            RequestEntity<Any>(headers, method!!, URI("$basePath$path"))
        } else {
            RequestEntity<Any>(body, headers, method!!, URI("$basePath$path"))
        }
    }
}