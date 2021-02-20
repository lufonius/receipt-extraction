package ch.lucfonjallaz.drezip.bl.receipt.item

data class ReceiptItemDto   (
        val id: Int = 0,
        val receiptId: Int,
        val type: ReceiptItemType,
        val label: String,
        var labelLineId: Int,
        val amount: Float,
        val amountLineId: Int,
        var categoryId: Int? = null
)