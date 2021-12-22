package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.bl.receipt.createTestUserDbo
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

    @InjectMockKs
    private lateinit var loginController: LoginController

    @Test
    fun `should log in a user`() {
        val loginRequest = LoginRequest(username = "Testuser", password = "Testpassword")
        val userDbo = createTestUserDbo(username = loginRequest.username, password = loginRequest.password)
        every { userService.findByUsername(loginRequest.username) }.returns(userDbo)
        every { passwordEncoder.matches(loginRequest.password, userDbo.password) }.returns(true)

        val token = "I AM A TOKEN"
        every { jwtService.generateToken(any()) }.returns(token)

        every { propertyService.env }.returns("prod")

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(response.headers.getFirst("Set-Cookie"))
                .isEqualTo("token=I AM A TOKEN;SameSite=Strict;HttpOnly;Secure")
    }

    @Test
    fun `should reject a log in request when the username is not correct`() {
        val loginRequest = LoginRequest(username = "Testuser", password = "Testpassword")
        every { userService.findByUsername(loginRequest.username) }
                .returns(null)

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.headers).isEmpty()
    }

    @Test
    fun `should reject a log in request when the password is not correct`() {
        val loginRequest = LoginRequest(username = "Testuser", password = "TestpasswordIncorrect")
        val userDetails = createTestUserDbo(username = loginRequest.username, password = loginRequest.password)
        every { userService.findByUsername(loginRequest.username) }.returns(userDetails)
        every { passwordEncoder.matches(loginRequest.password, userDetails.password) }.returns(false)

        val response = loginController.login(loginRequest)

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        assertThat(response.headers).isEmpty()
    }
}