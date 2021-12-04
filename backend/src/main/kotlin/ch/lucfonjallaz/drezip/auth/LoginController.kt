package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UsernameNotFoundException
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
        val propertyService: PropertyService
) {
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Unit> {
        try {
            val user = userService.loadUserByUsername(request.username)
            if (passwordEncoder.matches(request.password, user.password)) {
                val jwt = jwtService.generateToken(user)
                val response = ResponseEntity
                        .ok()
                        .header("Set-Cookie", getCookieValue(jwt))
                        .build<Unit>()

                return response
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
            }
        } catch(e: UsernameNotFoundException) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
    }

    private fun getCookieValue(jwt: String): String {
        if (propertyService.env === "prod") {
            return "token=$jwt;SameSite=Strict;HttpOnly;Secure"
        } else {
            return "token=$jwt;HttpOnly"
        }
    }
}