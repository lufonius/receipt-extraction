package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.stereotype.Component
import java.util.*

@Component
class DateFactory {
    fun generateCurrentDate() = Date()
}