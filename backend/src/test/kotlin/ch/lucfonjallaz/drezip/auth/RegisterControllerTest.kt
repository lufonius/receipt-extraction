package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.bl.receipt.createTestCustomUser
import ch.lucfonjallaz.drezip.bl.receipt.createTestUserDbo
import ch.lucfonjallaz.drezip.core.PropertyService
import ch.lucfonjallaz.drezip.core.ServiceError
import ch.lucfonjallaz.drezip.core.ServiceErrorCode
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus

@ExtendWith(MockKExtension::class)
class RegisterControllerTest {

    @MockK
    private lateinit var userService: UserService

    @MockK
    private lateinit var jwtService: JwtService

    @MockK
    private lateinit var cookieFactory: CookieFactory

    @InjectMockKs
    private lateinit var registerController: RegisterController

    @Test
    fun `should register a new user`() {
        // given
        val customUser = createTestCustomUser(username = "username", password = "password")
        val token = "Brunzli"

        every { userService.registerNewUser("username", "password") }.returns(customUser)
        every { jwtService.generateToken(customUser) }.returns(token)
        every { cookieFactory.generateCookie(token) }.returns("token=Banana")

        // when
        val response = registerController.register(RegisterRequest(email = "username", password = "password"))

        // then
        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(response.headers.get("Set-Cookie")).isNotEmpty
        assertThat(response.headers.get("Set-Cookie")?.first()).isEqualTo("token=Banana")
    }

    @Test
    fun `should confirm a newly registered user`() {
        // given
        val currentUserDbo = createTestUserDbo()
        val confirmedUser = createTestCustomUser(registrationConfirmed = true)
        val token = "Brunzli"

        every { userService.confirmRegistration("123", currentUserDbo) }.returns(confirmedUser)
        every { jwtService.generateToken(confirmedUser) }.returns(token)
        every { cookieFactory.generateCookie(token) }.returns("token=Banana")

        // when
        val response = registerController.confirmRegistration(ConfirmRegistrationRequest(code = "123"), currentUserDbo)

        // then
        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(response.headers.get("Set-Cookie")).isNotEmpty
        assertThat(response.headers.get("Set-Cookie")?.first()).isEqualTo("token=Banana")
    }

    @Test
    fun `should not confirm a newly registered user if registration code expired`() {
        // given
        val currentUserDbo = createTestUserDbo()

        every { userService.confirmRegistration("123", currentUserDbo) }.throws(RegistrationCodeExpiredException())
        every { cookieFactory.generateEmptyCookie() }.returns("token=")

        // when
        val response = registerController.confirmRegistration(ConfirmRegistrationRequest(code = "123"), currentUserDbo)

        // then
        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat((response.body as ServiceError).errorCode).isEqualTo(ServiceErrorCode.REGISTRATION_CODE_EXPIRED)
        assertThat(response.headers.get("Set-Cookie")).isNotEmpty
        assertThat(response.headers.get("Set-Cookie")?.first()).isEqualTo("token=")
    }

    @Test
    fun `should not confirm a newly registered user if registration code is not matching`() {
        // given
        val currentUserDbo = createTestUserDbo()

        every { userService.confirmRegistration("123", currentUserDbo) }.throws(RegistrationCodeNotMatchingException())

        // when
        val response = registerController.confirmRegistration(ConfirmRegistrationRequest(code = "123"), currentUserDbo)

        // then
        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat((response.body as ServiceError).errorCode).isEqualTo(ServiceErrorCode.REGISTRATION_CODE_NOT_MATCHING)
    }

    @Test
    fun `should not confirm a newly registered user if user already confirmed`() {
        // given
        val currentUserDbo = createTestUserDbo()

        every { userService.confirmRegistration("123", currentUserDbo) }.throws(UserAlreadyConfirmedException())

        // when
        val response = registerController.confirmRegistration(ConfirmRegistrationRequest(code = "123"), currentUserDbo)

        // then
        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat((response.body as ServiceError).errorCode).isEqualTo(ServiceErrorCode.USER_ALREADY_CONFIRMED)
    }
}