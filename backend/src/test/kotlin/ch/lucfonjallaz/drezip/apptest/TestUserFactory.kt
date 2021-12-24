package ch.lucfonjallaz.drezip.apptest

import ch.lucfonjallaz.drezip.util.UUIDForTestGenerator
import ch.lucfonjallaz.drezip.auth.login.LoginRequest
import ch.lucfonjallaz.drezip.auth.register.RegisterRequest
import ch.lucfonjallaz.drezip.auth.UserDbo
import org.assertj.core.api.Assertions
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import javax.persistence.EntityManager

class TestUserFactory(private val apiBaseUrl: String, private val entityManager: EntityManager) {
    private val password: String = "password"

    fun createRandomTestUser(): TestUser {
        val usernameOfNewRandomUser = registerNewUser(password)
        return TestUser(
            dbo = getUserDboByUsername(usernameOfNewRandomUser),
            cookie = login(usernameOfNewRandomUser, password)
        )
    }

    private fun registerNewUser(password: String): String {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val username = UUIDForTestGenerator.generateRandomUUID()
        val registerRequest = RegisterRequest(username, password)

        val restTemplate = TestRestTemplate()
        val jwt = restTemplate.exchange("$apiBaseUrl/api/register", HttpMethod.POST, HttpEntity(registerRequest, headers), String::class.java)

        val setCookieHeader = jwt.headers.get("Set-Cookie")?.first()
        Assertions.assertThat(setCookieHeader).isNotNull
        Assertions.assertThat(setCookieHeader?.split(".")?.size).isEqualTo(3)

        return username
    }

    private fun login(username: String, password: String): String {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON

        val loginRequest = LoginRequest(username, password)

        val restTemplate = TestRestTemplate()
        val response = restTemplate.exchange("$apiBaseUrl/api/login", HttpMethod.POST, HttpEntity(loginRequest, headers), String::class.java)

        val setCookieHeader = response.headers.get("Set-Cookie")?.first()
        Assertions.assertThat(setCookieHeader).isNotNull
        Assertions.assertThat(setCookieHeader?.split(".")?.size).isEqualTo(3)

        return setCookieHeader!!
    }

    private fun getUserDboByUsername(username: String): UserDbo {
        return entityManager
                .createQuery("select u from UserDbo u where u.username=:username")
                .setParameter("username", username)
                .singleResult as UserDbo
    }
}