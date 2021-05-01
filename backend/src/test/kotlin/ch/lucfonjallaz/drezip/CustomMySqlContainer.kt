package ch.lucfonjallaz.drezip

import org.testcontainers.containers.MySQLContainer

class CustomMySqlContainer : MySQLContainer<Nothing>("mysql:8.0") {
    override fun start() {
        super.start()

        System.setProperty("DB_URL", jdbcUrl)
        System.setProperty("DB_USERNAME", username)
        System.setProperty("DB_PASSWORD", password)
    }
}