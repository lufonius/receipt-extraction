package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.PropertyService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCrypt
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.AbstractPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.net.http.HttpResponse

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
            return "token=$jwt;HttpOnly;Secure"
        } else {
            return "token=$jwt;HttpOnly"
        }
    }
}
