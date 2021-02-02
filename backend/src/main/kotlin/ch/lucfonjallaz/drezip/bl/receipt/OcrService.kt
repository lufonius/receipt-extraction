package ch.lucfonjallaz.drezip.bl.receipt

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component

@Component
class OcrService(
        @Value("\${app.ocr-key}") val ocrKey: String,
        @Value("\${app.ocr-url}") val ocrUrl: String,
        @Value("\${app.ocr-retry-count:50}") val ocrRetryCount: Int,
        @Value("\${app.ocr-retry-sleep-ms:500}") val ocrRetrySleepMs: Long,
        val restTemplateBuilder: RestTemplateBuilder
) {
    fun extractText(imageUrl: String): AzureReadResultDto {
        val operationLocationUrl = getOperationLocationUrl(imageUrl)

        for (i in 1..ocrRetryCount) {
            val result = getOperationResult(operationLocationUrl)

            if (result.status == "succeeded") {
                return result.analyzeResult?.readResults?.firstOrNull() ?: throw Exception("no text to extract found")
            } else if (result.status == "failed") {
                throw Exception("OCR call failed")
            } else {
                Thread.sleep(ocrRetrySleepMs)
            }
        }

        throw Exception("OCR call timed out")
    }

    private fun getOperationLocationUrl(imageUrl: String): String {
        val restTemplate = restTemplateBuilder.build()
        val headers = HttpHeaders()
        headers.add("Ocp-Apim-Subscription-Key", ocrKey)
        headers.add("Content-Type", "application/json")

        val entity = HttpEntity(mapOf("url" to imageUrl), headers)

        val response = restTemplate.exchange(ocrUrl, HttpMethod.POST, entity, Map::class.java)

        return response.headers.getFirst("Operation-Location") ?: throw Exception("no operation location header present")
    }

    private fun getOperationResult(operationLocationUrl: String): AzureRequestResultsDto {
        val restTemplate = restTemplateBuilder.build()
        val headers = HttpHeaders()
        headers.add("Ocp-Apim-Subscription-Key", ocrKey)

        val entity = HttpEntity<HttpHeaders>(headers)

        val response = restTemplate.exchange(operationLocationUrl, HttpMethod.GET, entity, AzureRequestResultsDto::class.java)

        if (response.statusCode == HttpStatus.OK) {
            return response.body ?: throw Exception("response body was empty")
        } else {
            throw Exception("OCR call failed")
        }
    }
}

data class AzureRequestResultsDto (
        val status: String,
        val analyzeResult: AzureAnalyzeResultDto?
)

data class AzureAnalyzeResultDto (
        val readResults: List<AzureReadResultDto>
)

data class AzureReadResultDto(
        val angle: Float,
        val lines: List<AzureLineDto>
)

data class AzureLineDto (
        val boundingBox: List<Int>,
        val text: String
)