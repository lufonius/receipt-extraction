package ch.lucfonjallaz.drezip.auth

data class LoginRequest(
    val username: String,
    val password: String
)