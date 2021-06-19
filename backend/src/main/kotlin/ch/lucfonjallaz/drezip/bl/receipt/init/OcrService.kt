package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.HttpRequestService
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Component

@Component
class OcrService(
        @Value("\${app.azure-blob-storage.host}") val blobStorageHost: String,
        @Value("\${app.ocr-key}") val ocrKey: String,
        @Value("\${app.ocr-url}") val ocrUrl: String,
        @Value("\${app.ocr-retry-count:50}") val ocrRetryCount: Int,
        @Value("\${app.ocr-retry-sleep-ms:500}") val ocrRetrySleepMs: Long,
        val httpRequestService: HttpRequestService
) {
    fun extractText(imageUrl: String): AzureReadResultDto? {
        val operationLocationUrl = getOperationLocationUrl("$blobStorageHost$imageUrl")

        for (i in 1..ocrRetryCount) {
            val result = getOperationResult(operationLocationUrl)

            when (result.status) {
                "succeeded" -> return result.analyzeResult?.readResults?.firstOrNull() ?: throw Exception("no text to extract found")
                "failed" -> return null
                else -> Thread.sleep(ocrRetrySleepMs)
            }
        }

        return null
    }

    private fun getOperationLocationUrl(imageUrl: String): String {
        val headers = HttpHeaders()
        headers.add("Ocp-Apim-Subscription-Key", ocrKey)
        headers.add("Content-Type", "application/json")

        val response = httpRequestService.post(ocrUrl, mapOf("url" to imageUrl), headers, Unit::class)

        return response.headers.getFirst("Operation-Location") ?: throw Exception("no operation location header present")
    }

    private fun getOperationResult(operationLocationUrl: String): AzureRequestResultsDto {
        val headers = HttpHeaders()
        headers.add("Ocp-Apim-Subscription-Key", ocrKey)

        val response = httpRequestService.get(operationLocationUrl, headers, AzureRequestResultsDto::class)

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