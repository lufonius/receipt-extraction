package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.BaseIntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class ReceiptFormExtractionServiceUnitIntegrationTest : BaseIntegrationTest() {
    @Autowired private lateinit var receiptFormExtractionService: ReceiptFormExtractionService
    @Autowired private lateinit var mapper: ReceiptDoMapper

    @Test
    fun testService() {
        val fields = receiptFormExtractionService.extractFields("https://media-cdn.tripadvisor.com/media/photo-p/0e/54/47/43/receipt.jpg")
        if (fields !== null) {
            val receiptDo = mapper.mapAzureFormToReceiptDo(fields)
            val test = 1
        }
    }
}