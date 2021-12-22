package ch.lucfonjallaz.drezip.bl.receipt.init

import com.azure.ai.formrecognizer.models.RecognizedForm

interface ReceiptFormExtractionService {
    fun extractFields(imageUrl: String): RecognizedForm?
}