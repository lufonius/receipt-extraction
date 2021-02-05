package ch.lucfonjallaz.drezip.bl.receipt

import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@ExtendWith(MockKExtension::class)
class OcrServiceTest {

    @MockK
    private lateinit var httpRequestService: HttpRequestService

    private lateinit var ocrService: OcrService
    private val ocrKey = "ocrKey"
    private val ocrUrl = "ocrUrl"
    private val ocrRetryCount = 2
    private val ocrRetrySleepMs = 50L

    @BeforeEach
    fun beforeEach() {
        ocrService = OcrService(ocrKey, ocrUrl, ocrRetryCount, ocrRetrySleepMs, httpRequestService)
    }

    @Test
    fun `should return the extracted text`() {
        val operationLocationUrl = "operationLocationUrl"
        val headers = HttpHeaders()
        headers.add("Operation-Location", operationLocationUrl)
        val response = ResponseEntity<Unit>(null, headers, HttpStatus.OK)

        every { httpRequestService.post(url = eq(ocrUrl), headers = any(), body = match<Map<String, String>> { it["url"] == "imageUrl" }, returnType = Unit::class) }
                .returns(response)

        val readResult = AzureReadResultDto(angle = 90.0F, lines = listOf())
        val azureResponse = AzureRequestResultsDto(
                status = "succeeded",
                analyzeResult = AzureAnalyzeResultDto(readResults = listOf(readResult))
        )
        val azureResponseEntity = ResponseEntity(azureResponse, HttpStatus.OK)
        every { (httpRequestService.get(url = eq(operationLocationUrl), headers = any(), returnType = AzureRequestResultsDto::class)) }
                .returns(azureResponseEntity)

        val extractedText = ocrService.extractText("imageUrl")

        assertThat(extractedText)
                .usingRecursiveComparison()
                .isEqualTo(readResult)
    }

    @Test
    fun `should throw Exception when call to OCR was successfull, but no text was detected`() {
        val operationLocationUrl = "operationLocationUrl"
        val headers = HttpHeaders()
        headers.add("Operation-Location", operationLocationUrl)
        val response = ResponseEntity<Unit>(null, headers, HttpStatus.OK)

        every { httpRequestService.post(url = eq(ocrUrl), headers = any(), body = match<Map<String, String>> { it["url"] == "imageUrl" }, returnType = Unit::class) }
                .returns(response)

        val azureResponse = AzureRequestResultsDto(
                status = "succeeded",
                analyzeResult = AzureAnalyzeResultDto(
                        readResults = listOf()
                )
        )
        val azureResponseEntity = ResponseEntity(azureResponse, HttpStatus.OK)
        every { httpRequestService.get(url = eq(operationLocationUrl), headers = any(), returnType = AzureRequestResultsDto::class)}
                .returns(azureResponseEntity)

        val exception = assertThrows<Exception> { ocrService.extractText("imageUrl") }

        assertThat(exception.message).isEqualTo("no text to extract found")
    }

    @Test
    fun `should return null when the call failed`() {
        val operationLocationUrl = "operationLocationUrl"
        val headers = HttpHeaders()
        headers.add("Operation-Location", operationLocationUrl)
        val response = ResponseEntity<Unit>(null, headers, HttpStatus.OK)

        every { httpRequestService.post(url = eq(ocrUrl), headers = any(), body = match<Map<String, String>> { it["url"] == "imageUrl" }, returnType = Unit::class) }
                .returns(response)

        val azureResponse = AzureRequestResultsDto(
                status = "failed",
                analyzeResult = null
        )
        val azureResponseEntity = ResponseEntity(azureResponse, HttpStatus.OK)
        every { httpRequestService.get(url = eq(operationLocationUrl), headers = any(), returnType = AzureRequestResultsDto::class) }
                .returns(azureResponseEntity)

        val extractedText = ocrService.extractText("imageUrl")

        assertThat(extractedText).isNull()
    }

    @Test
    fun `should return null when the call timed out`() {
        val operationLocationUrl = "operationLocationUrl"
        val headers = HttpHeaders()
        headers.add("Operation-Location", operationLocationUrl)
        val response = ResponseEntity<Unit>(null, headers, HttpStatus.OK)

        every {
            httpRequestService.post(
                    url = eq(ocrUrl),
                    headers = any(),
                    body = match<Map<String, String>> { it["url"] == "imageUrl" },
                    returnType = Unit::class
            )
        }.returns(response)

        val azureResponse = AzureRequestResultsDto(
                status = "pending",
                analyzeResult = null
        )
        val azureResponseEntity = ResponseEntity(azureResponse, HttpStatus.OK)
        every  { httpRequestService.get(url = eq(operationLocationUrl), headers = any(), returnType = AzureRequestResultsDto::class) }
                .returns(azureResponseEntity)

        val extractedText = ocrService.extractText("imageUrl")

        assertThat(extractedText).isNull()
    }
}