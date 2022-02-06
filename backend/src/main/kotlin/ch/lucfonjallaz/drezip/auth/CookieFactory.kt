package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component
import java.util.*
import javax.servlet.http.Cookie

@Component
class CookieFactory(val propertyService: PropertyService) {
    // httpOnly = false is a security issue (xss attacks), we leave it for simplicity
    // and because this app is not used by real users
    fun generateCookie(key: String, value: String, maxAgeSeconds: Int, httpOnly: Boolean = false): String {
        val cookie = ResponseCookie.from(key, value)
        cookie.httpOnly(httpOnly)
        cookie.maxAge(maxAgeSeconds.toLong())
        cookie.path("/")

        if (propertyService.env === "prod") {
            cookie.sameSite("Strict")
            cookie.secure(true)
        }

        return cookie.build().toString()
    }

    fun generateResetCookie(key: String): String {
        val cookie = ResponseCookie.from(key, "")
        cookie.maxAge(0)

        return cookie.build().toString()
    }
}