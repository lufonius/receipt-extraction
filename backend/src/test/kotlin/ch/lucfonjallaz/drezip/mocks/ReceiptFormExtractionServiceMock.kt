package ch.lucfonjallaz.drezip.mocks

import ch.lucfonjallaz.drezip.bl.receipt.init.ReceiptFormExtractionService
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData.createFieldData
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData.createFloatFieldValue
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData.createFormField
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData.createListFieldValue
import ch.lucfonjallaz.drezip.util.RecognizedFormTestData.createMapFieldValue
import com.azure.ai.formrecognizer.models.*

class ReceiptFormExtractionServiceMock : ReceiptFormExtractionService {
    override fun extractFields(imageUrl: String): RecognizedForm {
        return RecognizedForm(mapOf(
                "Items" to FormField(
                        "Items",
                        createFieldData(),
                        createFieldData(),
                        createListFieldValue(listOf(
                                createFormField(
                                        "Items",
                                        createMapFieldValue(mapOf(
                                                "TotalPrice" to createFormField(
                                                        "TotalPrice",
                                                        createFloatFieldValue(20.0F),
                                                        listOf(
                                                                Point(0F, 1F),
                                                                Point(2F, 3F),
                                                                Point(4F, 5F),
                                                                Point(6F, 7F),
                                                        )
                                                ),
                                                "Name" to createFormField(
                                                        "Name",
                                                        RecognizedFormTestData.createStringFieldValue("Bananen"),
                                                        listOf(
                                                                Point(0F, 1F),
                                                                Point(2F, 3F),
                                                                Point(4F, 5F),
                                                                Point(6F, 7F),
                                                        )
                                                )
                                        ))
                                ),
                                createFormField(
                                        "Items",
                                        createMapFieldValue(mapOf(
                                                "TotalPrice" to createFormField(
                                                        "TotalPrice",
                                                        createFloatFieldValue(25.0F),
                                                        listOf(
                                                                Point(0F, 1F),
                                                                Point(2F, 3F),
                                                                Point(4F, 5F),
                                                                Point(6F, 7F),
                                                        )
                                                ),
                                                "Name" to createFormField(
                                                        "Name",
                                                        RecognizedFormTestData.createStringFieldValue("Apfel"),
                                                        listOf(
                                                                Point(0F, 1F),
                                                                Point(2F, 3F),
                                                                Point(4F, 5F),
                                                                Point(6F, 7F),
                                                        )
                                                )
                                        ))
                                )
                        )
                        ),
                        1.0F
                ),
                "MerchantName" to createFormField(
                        "MerchantName",
                        RecognizedFormTestData.createStringFieldValue("Migros")
                ),
                "Total" to createFormField(
                        "Total",
                        createFloatFieldValue(20.0F)
                ),
                "TransactionDate" to createFormField(
                        "TransactionDate",
                        RecognizedFormTestData.createStringFieldValue("not relevant"),
                        createFieldData(text = "20.03.2020")
                )
        ),
                "Receipt",
                FormPageRange(0, 0),
                listOf(FormPage(
                        0F,
                        0F,
                        LengthUnit.PIXEL,
                        0F,
                        listOf(FormLine(
                                "line",
                                FieldBoundingBox(listOf(
                                        Point(0F, 1F),
                                        Point(2F, 3F),
                                        Point(4F, 5F),
                                        Point(6F, 7F),
                                )),
                                0,
                                listOf()
                        )),
                        listOf(),
                        0
                ))
        )
    }
}