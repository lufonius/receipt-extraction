package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.stereotype.Component
import java.util.*

@Component
class UUIDGenerator {
    fun generateRandomUUID() = UUID.randomUUID().toString()
}