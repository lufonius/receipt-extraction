package ch.lucfonjallaz.drezip.mocks

import ch.lucfonjallaz.drezip.bl.receipt.init.ReceiptFormExtractionService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary

// it can get easily confusing what profile has which bean activated
// we ditch the principle of locality to take countermeasures
@Configuration
class MockConfiguration {

    @Bean
    @Primary
    fun getFormExtractionMock(): ReceiptFormExtractionService {
        return ReceiptFormExtractionServiceMock()
    }
}