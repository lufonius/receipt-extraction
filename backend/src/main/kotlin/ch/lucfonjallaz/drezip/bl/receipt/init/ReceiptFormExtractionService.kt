package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.core.PropertyService
import org.springframework.stereotype.Component
import com.azure.ai.formrecognizer.FormRecognizerClientBuilder
import com.azure.ai.formrecognizer.models.RecognizeReceiptsOptions
import com.azure.ai.formrecognizer.models.RecognizedForm
import com.azure.core.credential.AzureKeyCredential
import com.azure.core.util.Context

@Component
class ReceiptFormExtractionService(val propertyService: PropertyService) {
    fun extractFields(imageUrl: String): RecognizedForm? {
        val credential = AzureKeyCredential(propertyService.formRecognizerKey)
        val formRecognizerClient = FormRecognizerClientBuilder()
                .endpoint(propertyService.formRecognizerUrl)
                .credential(credential)
                .buildClient()

        val options = RecognizeReceiptsOptions()
        options.isFieldElementsIncluded = true

        return formRecognizerClient.beginRecognizeReceiptsFromUrl(imageUrl, options, Context.NONE).finalResult.firstOrNull()
    }
}