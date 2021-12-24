package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.auth.register.RegistrationCodeExpiredException
import ch.lucfonjallaz.drezip.auth.register.RegistrationCodeNotMatchingException
import ch.lucfonjallaz.drezip.auth.register.UserAlreadyConfirmedException
import ch.lucfonjallaz.drezip.bl.receipt.DateFactory
import ch.lucfonjallaz.drezip.bl.receipt.UUIDGenerator
import ch.lucfonjallaz.drezip.bl.receipt.createTestUserDbo
import ch.lucfonjallaz.drezip.core.PropertyService
import ch.lucfonjallaz.drezip.util.UUIDForTestGenerator
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

@ExtendWith(MockKExtension::class)
class UserServiceTest {

    @MockK
    private lateinit var userRepository: UserRepository

    @MockK
    private lateinit var passwordEncoder: PasswordEncoder

    @MockK
    private lateinit var uuidGenerator: UUIDGenerator

    @MockK
    private lateinit var emailService: EmailService

    @MockK
    private lateinit var dateFactory: DateFactory

    @MockK
    private lateinit var propertyService: PropertyService

    @InjectMockKs
    private lateinit var userService: UserService

    @Test
    fun `should register a new user`() {
        // given
        val username = UUIDForTestGenerator.generateRandomUUID() + "@tester.com"
        val password = "testPassword"
        val dateTime = LocalDateTime.now()

        every { dateFactory.generateCurrentDateTime() }.returns(dateTime)
        every { uuidGenerator.generateRandomUUID() }.returns("registration-code")
        every { passwordEncoder.encode(password) }.returns("encodedPassword")
        every { propertyService.domain }.returns("http://localhost")
        every { propertyService.confirmRegistrationLink }.returns("confirm-registration-link")
        every { userRepository.findByUsername(username) }.returns(null)
        every { userRepository.save(any()) }
                .returns(createTestUserDbo(username = "irrelevant since we do nothing with the return value"))
        every { emailService.sendRegistrationConfirmationEmail(username, "http://localhost/confirm-registration-link/registration-code") }.returns(Unit)

        // when
        val customUser = userService.registerNewUser(username, password)

        // then
        assertThat(customUser.registrationConfirmationCode).isEqualTo("registration-code")
        assertThat(customUser.registeredAt).isEqualTo(dateTime)
        assertThat(customUser.registrationConfirmed).isEqualTo(false)
        assertThat(customUser.email).isEqualTo(username)
        assertThat(customUser.username).isEqualTo(username)
        assertThat(customUser.password).isEqualTo("encodedPassword")
    }

    @Test
    fun `should not register a user if the username is already being used`() {
        // given
        val username = UUIDForTestGenerator.generateRandomUUID() + "@tester.com"

        every { userRepository.findByUsername(username) }.returns(createTestUserDbo())

        // when
        assertThrows<UserAlreadyExistsException> { userService.registerNewUser(username, "password") }
    }

    @Test
    fun `should confirm a user registration`() {
        // given
        val currentDateTime = LocalDateTime.now()
        val code = "123"
        val userDbo = createTestUserDbo(
            registrationConfirmed = false,
            registrationConfirmationCode = "123",
            registeredAt = currentDateTime.plusMinutes(10)
        )

        every { dateFactory.generateCurrentDateTime() } returns currentDateTime
        every { propertyService.registrationLinkExpiryInMins }.returns(120)
        every { userRepository.save(match { userDbo -> userDbo.registrationConfirmed }) }
                .returns(userDbo.copy(registrationConfirmed = true))

        // when
        val confirmedUser = userService.confirmRegistration(code, userDbo)

        // then
        assertThat(confirmedUser.registrationConfirmed).isEqualTo(true)
    }

    @Test
    fun `should not confirm a user registration when the registration code is expired`() {
        // given
        val currentDateTime = LocalDateTime.now()
        val code = "123"
        val userDbo = createTestUserDbo(
                registrationConfirmed = false,
                registrationConfirmationCode = "123",
                registeredAt = currentDateTime.minusMinutes(121)
        )

        every { dateFactory.generateCurrentDateTime() } returns currentDateTime
        every { userRepository.deleteById(userDbo.id) }.returns(Unit)
        every { propertyService.registrationLinkExpiryInMins }.returns(120)

        // when / then
        assertThrows<RegistrationCodeExpiredException> { userService.confirmRegistration(code, userDbo) }
    }

    @Test
    fun `should not confirm a user registration when the user is already confirmed`() {
        // given
        val currentDateTime = LocalDateTime.now()
        val code = "123"
        val userDbo = createTestUserDbo(
                registrationConfirmed = true,
                registrationConfirmationCode = "123",
                registeredAt = currentDateTime
        )

        // when / then
        assertThrows<UserAlreadyConfirmedException> { userService.confirmRegistration(code, userDbo) }
    }

    @Test
    fun `should not confirm a user registration when the code does not match`() {
        // given
        val currentDateTime = LocalDateTime.now()
        val code = "123"
        val userDbo = createTestUserDbo(
                registrationConfirmed = true,
                registrationConfirmationCode = "1234",
                registeredAt = currentDateTime
        )

        // when
        assertThrows<RegistrationCodeNotMatchingException> { userService.confirmRegistration(code, userDbo) }
    }
}
