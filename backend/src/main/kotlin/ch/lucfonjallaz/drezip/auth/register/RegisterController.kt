package ch.lucfonjallaz.drezip.auth.register

import ch.lucfonjallaz.drezip.auth.*
import ch.lucfonjallaz.drezip.core.ServiceError
import ch.lucfonjallaz.drezip.core.ServiceErrorCode
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/*
* TODO: add captcha for registering and login
* TODO: add mechanism of sending a link to the email adress, which has to be opened
* TODO: 2factor auth
* TODO: IP Address logging and blacklisting JWTs
* TODO: IP Address logging in separate redis cache (in own pod)
*  TODO: Housekeeping to clean up expired registration attempts (Kubernetes batchjob??) (batchjob on different nodes -> race conditions!)
* */

@RestController
@CrossOrigin("*")
class RegisterController(
        private val userService: UserService,
        private val authenticationCookieService: AuthenticationCookieService,
        private val cookieFactory: CookieFactory
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Any> {
        try {
            val newUser = userService.registerNewUser(request.email, request.password)

            val authenticationCookie = authenticationCookieService.generateAuthenticationCookie(newUser)
            return ResponseEntity
                    .ok()
                    .header("Set-Cookie", authenticationCookie)
                    .build()
        } catch(exc: UserAlreadyExistsException) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ServiceError(ServiceErrorCode.USER_ALREADY_EXISTS))
        }
    }

    @PostMapping("/confirm-registration")
    fun confirmRegistration(@RequestBody confirmRequest: ConfirmRegistrationRequest, @AuthenticatedUser userDbo: UserDbo): ResponseEntity<Any> {
        try {
            val confirmedUser = userService.confirmRegistration(confirmRequest.code, userDbo)
            val authenticationCookie = authenticationCookieService.generateAuthenticationCookie(confirmedUser)
            return ResponseEntity
                    .ok()
                    .header("Set-Cookie", authenticationCookie)
                    .build()
        } catch (exc: RegistrationCodeExpiredException) {
            val resetCookie = authenticationCookieService.generateResetAuthenticationCookie()
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .header("Set-Cookie", resetCookie)
                    .body(ServiceError(
                            errorCode = ServiceErrorCode.REGISTRATION_CODE_EXPIRED,
                            message = "The registration link has expired. You need to register again."
                    ))
        } catch (exc: RegistrationCodeNotMatchingException) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ServiceError(
                            errorCode = ServiceErrorCode.REGISTRATION_CODE_NOT_MATCHING,
                            message = "The registration link is invalid."
                    ))
        } catch (exc: UserAlreadyConfirmedException) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .header("Set-Cookie", "test=5")
                    .body(ServiceError(
                            errorCode = ServiceErrorCode.USER_ALREADY_CONFIRMED,
                            message = "You already confirmed your email address."
                    ))
        }
    }
}
