package ch.lucfonjallaz.drezip.bl.receipt.line

import org.springframework.stereotype.Component

@Component
class LineMapper {
    fun dtoFromDbo(dbo: LineDbo) = LineDto(
            id = dbo.id,
            topLeft = PointDto(dbo.topLeftX, dbo.topLeftY),
            topRight = PointDto(dbo.topRightX, dbo.topRightY),
            bottomRight = PointDto(dbo.bottomRightX, dbo.bottomRightY),
            bottomLeft = PointDto(dbo.bottomLeftX, dbo.bottomLeftY),
            text = dbo.text
    )
}