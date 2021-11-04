package ch.lucfonjallaz.drezip.bl.receipt.init

import java.util.*

data class ReceiptDo(
        val lines: List<LineDo>,
        val items: List<ItemDo>?,
        val date: Date?,
        val total: Float?,
        val merchant: String?
)