package ch.lucfonjallaz.drezip.auth

import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@CrossOrigin("*")
class CurrentUserController {

    @GetMapping("/current-user")
    fun getCurrentUser(@AuthenticatedUser userDbo: UserDbo): UserDto {
        return UserDto(
                username = userDbo.username,
                registrationConfirmed = userDbo.registrationConfirmed
        )
    }
}