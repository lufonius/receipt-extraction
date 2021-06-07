package ch.lucfonjallaz.drezip

import org.testcontainers.containers.MySQLContainer

class CustomMySqlContainer : MySQLContainer<Nothing>("mysql:8.0") {
    override fun start() {
        super.start()

        // those properties are used again in application-test.properties
        // for setting the connection details for spring, flyway and hikari
        System.setProperty("DB_URL", jdbcUrl)
        System.setProperty("DB_USERNAME", username)
        System.setProperty("DB_PASSWORD", password)
    }
}