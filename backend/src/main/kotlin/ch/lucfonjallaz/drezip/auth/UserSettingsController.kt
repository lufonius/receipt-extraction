package ch.lucfonjallaz.drezip.auth

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
class UserSettingsController(val userService: UserService) {
    @GetMapping("/user-settings")
    fun getUserSettings(@AuthenticatedUser userDbo: UserDbo): UserSettingsDto {
        return UserSettingsDto(hideAddToHomeScreen = userDbo.hideAddToHomeScreen)
    }

    @PutMapping("/user-settings")
    fun updateUserSettings(@AuthenticatedUser user: UserDbo, @RequestBody userSettingsDto: UserSettingsDto) {
        val updatedUser = user.copy(hideAddToHomeScreen = userSettingsDto.hideAddToHomeScreen)
        userService.updateUser(updatedUser)
    }
}