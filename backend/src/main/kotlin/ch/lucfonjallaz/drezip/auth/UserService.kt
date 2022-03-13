package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.auth.register.RegistrationCodeExpiredException
import ch.lucfonjallaz.drezip.auth.register.RegistrationCodeNotMatchingException
import ch.lucfonjallaz.drezip.auth.register.UserAlreadyConfirmedException
import ch.lucfonjallaz.drezip.bl.receipt.DateFactory
import ch.lucfonjallaz.drezip.bl.receipt.UUIDGenerator
import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
class UserService(
    val userRepository: UserRepository,
    val passwordEncoder: PasswordEncoder,
    val uuidGenerator: UUIDGenerator,
    val emailService: EmailService,
    val dateFactory: DateFactory,
    val propertyService: PropertyService
) : UserDetailsService {
    override fun loadUserByUsername(username: String): CustomUser {
        val user = userRepository
                .findByUsername(username)
                ?: throw UsernameNotFoundException("user $username not found")

        return CustomUserAdapter(user)
    }

    fun findByUsername(username: String): CustomUser? {
        val user = userRepository.findByUsername(username)
        return if (user == null) null else CustomUserAdapter(user)
    }

    @Transactional
    fun registerNewUser(username: String, password: String): CustomUser {
        if (findByUsername(username) == null) {
            val registrationCode = uuidGenerator.generateRandomUUID()
            val currentDateTime = dateFactory.generateCurrentDateTime()

            val newUserDbo = UserDbo(
                    username = username,
                    email = username,
                    password = passwordEncoder.encode(password),
                    registrationConfirmationCode = registrationCode,
                    registeredAt = currentDateTime,
                    registrationConfirmed = false
            )

            userRepository.save(newUserDbo)

            val registrationConfirmationLink = "${propertyService.confirmRegistrationLink}/${registrationCode}"
            emailService.sendRegistrationConfirmationEmail(username, registrationConfirmationLink)

            return CustomUserAdapter(newUserDbo)
        } else {
            throw UserAlreadyExistsException()
        }
    }

    @Transactional
    fun confirmRegistration(code: String, userDbo: UserDbo): CustomUser {
        if (code == userDbo.registrationConfirmationCode) {
            if (userDbo.registrationConfirmed) {
                throw UserAlreadyConfirmedException()
            }

            val currentDateTime = dateFactory.generateCurrentDateTime()
            val expiresAt = userDbo.registeredAt.plusMinutes(propertyService.registrationLinkExpiryInMins.toLong())
            if (currentDateTime.isBefore(expiresAt)) {
                val confirmedUserDbo = userDbo.copy(registrationConfirmed = true)
                userRepository.save(confirmedUserDbo)

                return CustomUserAdapter(confirmedUserDbo)
            } else {
                userRepository.deleteById(userDbo.id)
                throw RegistrationCodeExpiredException()
            }
        } else {
            throw RegistrationCodeNotMatchingException()
        }
    }

    fun updateUser(userDbo: UserDbo) {
        userRepository.save(userDbo)
    }
}