package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.core.ServiceErrorCode
import ch.lucfonjallaz.drezip.core.PropertyService
import ch.lucfonjallaz.drezip.core.ServiceError
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

// TODO: on signature exception, logout the user -> he must obtain a new access token (blacklist access token)
// TODO: when IP addresses changes, logout the user -> he must obtain a new access token (blacklist access token)
@RestController
@CrossOrigin("*")
class LoginController(
        val jwtService: JwtService,
        val userService: UserService,
        val passwordEncoder: PasswordEncoder,
        val propertyService: PropertyService,
        val cookieFactory: CookieFactory
) {
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        val user = userService.findByUsername(request.email)
        if (user != null && passwordEncoder.matches(request.password, user.password)) {
            val jwt = jwtService.generateToken(user)
            return ResponseEntity
                    .ok()
                    .header("Set-Cookie", cookieFactory.generateCookie(jwt))
                    .build()
        } else {
            // we could return a "user not found" error, but that would tell an attacker that this user
            // is non-existent, while returning "invalid credentials" could mean both and does not reveal more infos
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ServiceError(ServiceErrorCode.INVALID_CREDENTIALS))
        }
    }
}
