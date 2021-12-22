package ch.lucfonjallaz.drezip.util

import com.azure.ai.formrecognizer.models.*

object RecognizedFormTestData {
    fun createFormField(
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

    fun createFormField(
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

    fun createFieldData(text: String = "", boundingBox: List<Point> = listOf()) = FieldData(text, FieldBoundingBox(boundingBox), 0, listOf())

    fun createListFieldValue(values: List<Any> = listOf()): FieldValue {
        return FieldValue(
                values,
                FieldValueType.LIST
        )
    }

    fun createMapFieldValue(value: Map<String, FormField> = mapOf()): FieldValue {
        return FieldValue(
                value,
                FieldValueType.MAP
        )
    }

    fun createFloatFieldValue(value: Float = 0.0F): FieldValue {
        return FieldValue(
                value,
                FieldValueType.FLOAT
        )
    }

    fun createStringFieldValue(value: String = ""): FieldValue {
        return FieldValue(
                value,
                FieldValueType.STRING
        )
    }
}