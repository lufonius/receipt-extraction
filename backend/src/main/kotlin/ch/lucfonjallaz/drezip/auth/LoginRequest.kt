package ch.lucfonjallaz.drezip.auth

import javax.validation.constraints.Email

data class LoginRequest(
        @Email
        val email: String,
        val password: String
)