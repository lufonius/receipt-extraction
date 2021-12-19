package ch.lucfonjallaz.drezip.auth

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

// we could define a bean in the SecurityContext class as suggested in the tutorials, the problem is just
// that we create an implicit dependency to the SecurityContext class which can lead to circular dependencies
@Component
class CustomPasswordEncoder : PasswordEncoder, BCryptPasswordEncoder()