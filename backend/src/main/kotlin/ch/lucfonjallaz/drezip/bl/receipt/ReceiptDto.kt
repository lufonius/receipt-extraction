package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDto

data class ReceiptDto(
    val id: Int,
    val status: ReceiptStatus,
    val imgUrl: String,
    val angle: Float,
    val lines: List<LineDto>
) {
    companion object {
        fun fromDbo(dbo: ReceiptDbo): ReceiptDto {
            return ReceiptDto(
                    id = dbo.id,
                    status = dbo.status,
                    imgUrl = dbo.imgUrl,
                    angle = dbo.angle,
                    lines = dbo.lines.map { LineDto.fromDbo(it) }
            )
        }
    }
}