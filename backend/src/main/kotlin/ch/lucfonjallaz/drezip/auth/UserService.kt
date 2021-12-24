package ch.lucfonjallaz.drezip.auth

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
            val registrationCodeExpiresAt = currentDateTime.plusMinutes(propertyService.registrationLinkExpiryInMins.toLong())

            val newUserDbo = UserDbo(
                    username = username,
                    email = username,
                    password = passwordEncoder.encode(password),
                    registrationConfirmationCode = registrationCode,
                    registrationConfirmationCodeExpiresAt = registrationCodeExpiresAt,
                    registrationConfirmed = false
            )

            userRepository.save(newUserDbo)

            val registrationConfirmationLink = "${propertyService.domain}/${propertyService.confirmRegistrationLink}/${registrationCode}"
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

            if (dateFactory.generateCurrentDateTime().isBefore(userDbo.registrationConfirmationCodeExpiresAt)) {
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
}