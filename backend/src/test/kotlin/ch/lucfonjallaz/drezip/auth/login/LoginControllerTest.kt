package ch.lucfonjallaz.drezip.auth.login

import ch.lucfonjallaz.drezip.auth.CookieFactory
import ch.lucfonjallaz.drezip.auth.UserService
import ch.lucfonjallaz.drezip.auth.jwt.JwtService
import ch.lucfonjallaz.drezip.bl.receipt.createTestCustomUser
import ch.lucfonjallaz.drezip.core.PropertyService
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder

@ExtendWith(MockKExtension::class)
class LoginControllerTest {

    @MockK
    private lateinit var jwtService: JwtService

    @MockK
    private lateinit var  userService: UserService

    @MockK
    private lateinit var  passwordEncoder: PasswordEncoder

    @MockK
    private lateinit var  propertyService: PropertyService

    @MockK
    private lateinit var cookieFactory: CookieFactory

    @InjectMockKs
    private lateinit var loginController: LoginController

    @Test
    fun `should log in a user`() {
        val loginRequest = LoginRequest(email = "Testuser", password = "Testpassword")
        val customUser = createTestCustomUser(username = loginRequest.email, password = loginRequest.password)
        every { userService.findByUsername(loginRequest.email) }.returns(customUser)
        every { passwordEncoder.matches(loginRequest.password, customUser.password) }.returns(true)

        val token = "I AM A TOKEN"
        every { jwtService.generateToken(any()) }.returns(token)
        every { cookieFactory.generateCookie(token) }.returns("token=Hey")

        every { propertyService.env }.returns("prod")

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(response.headers.getFirst("Set-Cookie"))
                .isEqualTo("token=Hey")
    }

    @Test
    fun `should reject a log in request when the username is not correct`() {
        val loginRequest = LoginRequest(email = "Testuser", password = "Testpassword")
        every { userService.findByUsername(loginRequest.email) }
                .returns(null)

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.headers).isEmpty()
    }

    @Test
    fun `should reject a log in request when the password is not correct`() {
        val loginRequest = LoginRequest(email = "Testuser", password = "TestpasswordIncorrect")
        val customUser = createTestCustomUser(username = loginRequest.email, password = loginRequest.password)
        every { userService.findByUsername(loginRequest.email) }.returns(customUser)
        every { passwordEncoder.matches(loginRequest.password, customUser.password) }.returns(false)

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.headers).isEmpty()
    }
}