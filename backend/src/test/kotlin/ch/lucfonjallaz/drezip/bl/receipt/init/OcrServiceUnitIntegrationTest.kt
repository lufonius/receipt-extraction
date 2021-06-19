package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.BaseIntegrationTest
import ch.lucfonjallaz.drezip.bl.receipt.init.OcrService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

class OcrServiceUnitIntegrationTest : BaseIntegrationTest() {

    @Autowired
    private lateinit var ocrService: OcrService

    @Test
    fun `should extract text from an image`() {
        val imageUrl = "/test/receipt.jpg"

        val extractedText = ocrService.extractText(imageUrl)

        assertThat(extractedText).isNotNull
        assertThat(extractedText!!.angle).isNotNull()
        assertThat(extractedText.lines).isNotEmpty
    }
}