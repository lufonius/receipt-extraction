package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.auth.jwt.JwtService
import org.springframework.stereotype.Component
import java.util.*

@Component
class AuthenticationCookieService(
        val cookieFactory: CookieFactory,
        val jwtService: JwtService
) {
    fun generateAuthenticationCookie(user: CustomUser): String {
        val maxAgeJwtInSeconds = 60 * 60 * 10
        val maxAgeCookieInSeconds = maxAgeJwtInSeconds - 60
        val expiresAt = Date(System.currentTimeMillis() + 1000 * maxAgeJwtInSeconds)
        val jwtForAuthentication = jwtService.generateToken(user, expiresAt)
        return cookieFactory.generateCookie("token", jwtForAuthentication, maxAgeCookieInSeconds)
    }

    fun generateResetAuthenticationCookie(): String {
        return cookieFactory.generateResetCookie("token")
    }
}