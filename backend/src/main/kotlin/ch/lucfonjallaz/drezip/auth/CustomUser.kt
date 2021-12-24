package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime

interface CustomUser : UserDetails {
    fun getUserDbo(): UserDbo
    val registrationConfirmed: Boolean
    val registrationConfirmationCode: String
    val registrationConfirmationCodeExpiresAt: LocalDateTime
    val email: String
}