package ch.lucfonjallaz.drezip.bl.receipt.init

import com.azure.ai.formrecognizer.models.*
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import java.util.*
import java.util.GregorianCalendar

class ReceiptDoMapperTest {

    @Test
    fun testMapppingFromFormRecognitionResultToDo() {
        val recognizedForm = createRecognizedForm()

        val mapper = ReceiptDoMapper()

        val result = mapper.mapAzureFormToReceiptDo(recognizedForm)

        val expectedResult = ReceiptDo(
                lines = listOf(LineDo(
                        text = "line",
                        boundingBox = listOf(
                                PointDo(0F, 1F),
                                PointDo(2F, 3F),
                                PointDo(4F, 5F),
                                PointDo(6F, 7F),
                        )
                )),
                items = listOf(
                        ItemDo(
                            itemNameLineDo = LineDo(
                                text = "Bananen",
                                boundingBox = listOf(
                                    PointDo(0F, 1F),
                                    PointDo(2F, 3F),
                                    PointDo(4F, 5F),
                                    PointDo(6F, 7F),
                                )
                            ),
                            name = "Bananen",
                            priceLineDo = LineDo(
                                text = "20.0",
                                boundingBox = listOf(
                                    PointDo(0F, 1F),
                                    PointDo(2F, 3F),
                                    PointDo(4F, 5F),
                                    PointDo(6F, 7F),
                                )
                            ),
                            price = 20.0F
                        )
                    ),
                date = createDate(2020, 3, 20),
                total = 20.0F,
                merchant = "Migros"
        )

        Assertions.assertThat(result)
                .usingRecursiveComparison()
                .isEqualTo(expectedResult)
    }

    private fun createDate(year: Int, month: Int, day: Int): Date {
        return GregorianCalendar(year, month - 1, day).time
    }

    private fun createRecognizedForm(): RecognizedForm {
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
                                                        createStringFieldValue("Bananen"),
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
                        createStringFieldValue("Migros")
                ),
                "Total" to createFormField(
                        "Total",
                        createFloatFieldValue(20.0F)
                ),
                "TransactionDate" to createFormField(
                        "TransactionDate",
                        createStringFieldValue("not relevant"),
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

    private fun createFormField(
            name: String,
            value: FieldValue,
            boundingBox: List<Point> = listOf(),
            confidence: Float = 1.0F
    ) = FormField(
            name,
            createFieldData(),
            createFieldData(boundingBox = boundingBox),
            value,
            confidence
    )

    private fun createFormField(
            name: String,
            value: FieldValue,
            valueFieldData: FieldData,
            confidence: Float = 1.0F
    ) = FormField(
            name,
            createFieldData(),
            valueFieldData,
            value,
            confidence
    )

    private fun createFieldData(text: String = "", boundingBox: List<Point> = listOf()) = FieldData(text, FieldBoundingBox(boundingBox), 0, listOf())

    private fun createListFieldValue(values: List<Any> = listOf()): FieldValue {
        return FieldValue(
            values,
            FieldValueType.LIST
        )
    }

    private fun createMapFieldValue(value: Map<String, FormField> = mapOf()): FieldValue {
        return FieldValue(
            value,
            FieldValueType.MAP
        )
    }

    private fun createFloatFieldValue(value: Float = 0.0F): FieldValue {
        return FieldValue(
            value,
            FieldValueType.FLOAT
        )
    }

    private fun createStringFieldValue(value: String = ""): FieldValue {
        return FieldValue(
            value,
            FieldValueType.STRING
        )
    }
}