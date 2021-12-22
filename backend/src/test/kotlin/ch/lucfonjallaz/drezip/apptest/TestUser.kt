package ch.lucfonjallaz.drezip.apptest

import ch.lucfonjallaz.drezip.auth.UserDbo

data class TestUser(
    val dbo: UserDbo,
    val cookie: String
)