package ch.lucfonjallaz.drezip.bl.receipt.line

data class LineDto(
        val id: Int,
        val topLeft: PointDto,
        val topRight: PointDto,
        val bottomRight: PointDto,
        val bottomLeft: PointDto,
        val text: String
) {
    companion object {
        fun fromDbo(dbo: LineDbo): LineDto {
            return LineDto(
                    id = dbo.id,
                    topLeft = PointDto(dbo.topLeftX, dbo.topLeftY),
                    topRight = PointDto(dbo.topRightX, dbo.topRightY),
                    bottomRight = PointDto(dbo.bottomRightX, dbo.bottomRightY),
                    bottomLeft = PointDto(dbo.bottomLeftX, dbo.bottomLeftY),
                    text = dbo.text
            )
        }
    }
}

data class PointDto(
    val x: Int,
    val y: Int
)