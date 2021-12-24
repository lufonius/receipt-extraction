package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.util.*

@Component
class DateFactory {
    fun generateCurrentDate() = Date()
    fun generateCurrentDateTime() = LocalDateTime.now()
}