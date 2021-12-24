package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.GrantedAuthority
import java.time.LocalDateTime

class CustomUserAdapter(private val userDbo: UserDbo) : CustomUser {
    override fun getAuthorities(): MutableCollection<GrantedAuthority> {
        return mutableListOf()
    }

    override fun getUserDbo(): UserDbo = userDbo

    override val registrationConfirmed: Boolean
        get() = userDbo.registrationConfirmed

    override val registrationConfirmationCode: String
        get() = userDbo.registrationConfirmationCode

    override val registrationConfirmationCodeExpiresAt: LocalDateTime
        get() = userDbo.registrationConfirmationCodeExpiresAt

    override val email: String
        get() = userDbo.email

    override fun getPassword(): String {
        return userDbo.password
    }

    override fun getUsername(): String {
        return userDbo.username
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }
}