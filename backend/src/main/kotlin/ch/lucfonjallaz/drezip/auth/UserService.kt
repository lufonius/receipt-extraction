package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class UserService(
    val userRepository: UserRepository,
    val passwordEncoder: PasswordEncoder
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository
                .findByUsername(username)
                ?: throw UsernameNotFoundException("user $username not found")

        return CustomUserAdapter(user)
    }

    fun findByUsername(username: String) = userRepository.findByUsername(username)

    fun insertUser(username: String, password: String) = userRepository.save(
        UserDbo(username = username, password = passwordEncoder.encode(password))
    )
}