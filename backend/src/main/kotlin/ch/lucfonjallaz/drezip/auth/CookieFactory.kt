package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.stereotype.Component

@Component
class CookieFactory(val propertyService: PropertyService) {
    fun generateCookie(token: String): String {
        if (propertyService.env === "prod") {
            return "token=$token;SameSite=Strict;HttpOnly;Secure"
        } else {
            return "token=$token;HttpOnly"
        }
    }

    fun generateEmptyCookie() = "token="
}