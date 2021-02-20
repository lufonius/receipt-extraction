package ch.lucfonjallaz.drezip.bl.receipt.item

import com.fasterxml.jackson.annotation.JsonProperty

enum class ReceiptItemType {
    @JsonProperty("Category")
    Category,
    @JsonProperty("Tax")
    Tax
}