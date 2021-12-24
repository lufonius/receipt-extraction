package ch.lucfonjallaz.drezip.auth.register
import javax.validation.constraints.Email;

data class RegisterRequest(
        @Email
        val email: String,
        val password: String
)