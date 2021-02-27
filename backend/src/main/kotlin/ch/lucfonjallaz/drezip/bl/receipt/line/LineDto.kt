package ch.lucfonjallaz.drezip.bl.receipt.line

data class LineDto(
        val id: Int,
        val receiptId: Int,
        val topLeft: PointDto,
        val topRight: PointDto,
        val bottomRight: PointDto,
        val bottomLeft: PointDto,
        val text: String
)

data class PointDto(
    val x: Int,
    val y: Int
)