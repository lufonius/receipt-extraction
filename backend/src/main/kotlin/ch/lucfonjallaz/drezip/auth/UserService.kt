package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component

@Component
class UserService(val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository
                .findByUsername(username)
                ?: throw UsernameNotFoundException("user $username not found")

        return UserDetailsAdapter(user)
    }
}