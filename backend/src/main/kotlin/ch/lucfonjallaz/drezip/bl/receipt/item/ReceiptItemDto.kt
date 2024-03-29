package ch.lucfonjallaz.drezip.bl.receipt.item

data class ReceiptItemDto   (
        val id: Int = 0,
        val receiptId: Int,
        val label: String?,
        var labelLineId: Int?,
        val price: Float?,
        val valueLineId: Int?,
        var categoryId: Int? = null
)