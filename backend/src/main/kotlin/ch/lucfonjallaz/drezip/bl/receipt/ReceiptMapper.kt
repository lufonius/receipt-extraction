package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemMapper
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineMapper
import org.springframework.stereotype.Component
import javax.persistence.EntityManager

@Component
class ReceiptMapper(
        val entityManager: EntityManager,
        val receiptItemMapper: ReceiptItemMapper,
        val lineMapper: LineMapper
) {

    fun dtoFromDbo(dbo: ReceiptDbo) = ReceiptDto(
            id = dbo.id,
            status = dbo.status,
            imgUrl = dbo.imgUrl,
            angle = dbo.angle,
            lines = dbo.lines.map { lineMapper.dtoFromDbo(it) },
            total = dbo.total,
            totalLineId = dbo.totalLine?.id,
            date = dbo.date,
            dateLineId = dbo.dateLine?.id,
            items = dbo.items.map { receiptItemMapper.dtoFromDbo(it) }
    )

    fun dboFromDto(dto: ReceiptDto) = ReceiptDbo(
            id = dto.id,
            status = dto.status,
            imgUrl = dto.imgUrl,
            angle = dto.angle,
            total = dto.total,
            totalLine = entityManager.getReference(LineDbo::class.java, dto.totalLineId),
            date = dto.date,
            dateLine = entityManager.getReference(LineDbo::class.java, dto.dateLineId)
    )
}