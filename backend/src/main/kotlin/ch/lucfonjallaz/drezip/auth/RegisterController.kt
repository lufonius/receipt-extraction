package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.core.ServiceError
import ch.lucfonjallaz.drezip.core.ServiceErrorCode
import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

/*
* TODO: add captcha for registering and login
* TODO: add mechanism of sending a link to the email adress, which has to be opened
* TODO: 2factor auth
* TODO: IP Address logging and blacklisting JWTs
* TODO: IP Address logging in separate redis cache (in own pod)
* */

@RestController
@CrossOrigin("*")
class RegisterController(
        val userService: UserService,
        val propertyService: PropertyService,
        val jwtService: JwtService
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        val user = userService.findByUsername(request.username)

        if (user == null) {
            val newUser = userService.insertUser(request.username, request.password)

            val jwt = jwtService.generateToken(CustomUserAdapter(newUser))
            return ResponseEntity
                    .ok()
                    .header("Set-Cookie", getCookieValue(jwt))
                    .build()
        } else {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ServiceError(ServiceErrorCode.USER_ALREADY_EXISTS))
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
