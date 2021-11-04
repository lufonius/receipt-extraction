package ch.lucfonjallaz.drezip.bl.receipt.init

import org.springframework.stereotype.Component
import com.azure.ai.formrecognizer.FormRecognizerClientBuilder
import com.azure.ai.formrecognizer.models.RecognizeReceiptsOptions
import com.azure.ai.formrecognizer.models.RecognizedForm
import com.azure.core.credential.AzureKeyCredential
import com.azure.core.util.Context
import org.springframework.beans.factory.annotation.Value

@Component
class ReceiptFormExtractionService(
        @Value("\${app.form-recognizer-url}") val url: String,
        @Value("\${app.form-recognizer-key}") val key: String,
) {
    fun extractFields(imageUrl: String): RecognizedForm? {
        val credential = AzureKeyCredential(key)
        val formRecognizerClient = FormRecognizerClientBuilder()
                .endpoint(url)
                .credential(credential)
                .buildClient()

        val options = RecognizeReceiptsOptions()
        options.isFieldElementsIncluded = true

        return formRecognizerClient.beginRecognizeReceiptsFromUrl(imageUrl, options, Context.NONE).finalResult.firstOrNull()
    }
}