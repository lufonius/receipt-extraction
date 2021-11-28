package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import com.azure.ai.formrecognizer.models.FieldBoundingBox
import com.azure.ai.formrecognizer.models.RecognizedForm
import org.springframework.stereotype.Component
import java.util.*
import java.util.Calendar

@Component
class ReceiptDoMapper {
    fun mapAzureFormToReceiptDo(azureForm: RecognizedForm): ReceiptDo {
        val lines = azureForm.pages.first().lines.map { mapBoundingBoxAndTextToLineDo(it.boundingBox, it.text)}

        val items = azureForm.fields["Items"]?.value?.asList()?.map {
            val price = it.value.asMap()["TotalPrice"]?.value?.asFloat()
            val priceBoundingBox = it.value.asMap()["TotalPrice"]?.valueData?.boundingBox
            var priceLineDo: LineDo? = null
            if (priceBoundingBox !== null && price !== null) {
                priceLineDo = mapBoundingBoxAndTextToLineDo(priceBoundingBox, price.toString())
            }

            val name = it.value.asMap()["Name"]?.value?.asString()
            val nameBoundingBox = it.value.asMap()["Name"]?.valueData?.boundingBox
            var nameLineDo: LineDo? = null
            if (nameBoundingBox !== null && name !== null) {
                nameLineDo = mapBoundingBoxAndTextToLineDo(nameBoundingBox, name)
            }

            ItemDo(nameLineDo, name, priceLineDo, price)
        }?.filter { it.itemNameLineDo !== null && it.price !== null && it.name !== null  }

        val merchant = azureForm.fields["MerchantName"]?.value?.asString()
        val total = azureForm.fields["Total"]?.value?.asFloat()
        val dateAsString = azureForm.fields["TransactionDate"]?.valueData?.text
        var date: Date? = null
        if (dateAsString !== null) {
            date = tryExtractDate(dateAsString)
        }

        return ReceiptDo(lines, items, date, total, merchant)
    }

    private fun mapBoundingBoxAndTextToLineDo(boundingBox: FieldBoundingBox, text: String): LineDo {
        return LineDo(
                boundingBox.points.map { PointDo(it.x, it.y) },
                text
        );
    }

    fun mapDoToDbo(status: ReceiptStatus, uploadedAt: Date, imgUrl: String, receiptDo: ReceiptDo): ReceiptDbo {
        return ReceiptDbo(
                status = status,
                uploadedAt = uploadedAt,
                imgUrl = imgUrl,
                transactionTotal = receiptDo.total,
                transactionMerchant = receiptDo.merchant,
                transactionDate = receiptDo.date,
                items = emptyList()
        )
    }

    fun mapItemsDosToReceiptItemDbos(items: List<ItemDo>, receiptDbo: ReceiptDbo): List<ReceiptItemDbo> {
        return items.map {
            ReceiptItemDbo(
                    label = it.name,
                    labelLine = if (it.itemNameLineDo !== null) mapLineDoToDbo(it.itemNameLineDo, receiptDbo) else null,
                    valueLine = if (it.priceLineDo !== null) mapLineDoToDbo(it.priceLineDo, receiptDbo) else null,
                    price = it.price,
                    receipt = receiptDbo
            )
        }
    }

    fun mapLineDosToLineDbos(lineDos: List<LineDo>, receiptDbo: ReceiptDbo): List<LineDbo> {
        return lineDos.map { mapLineDoToDbo(it, receiptDbo) }
    }

    private fun mapLineDoToDbo(lineDo: LineDo, receiptDbo: ReceiptDbo): LineDbo {
        return LineDbo(
            text = lineDo.text,
            topLeftX = Math.floor(lineDo.boundingBox[0].x.toDouble()).toInt(),
            topLeftY = Math.floor(lineDo.boundingBox[0].y.toDouble()).toInt(),
            topRightX = Math.floor(lineDo.boundingBox[1].x.toDouble()).toInt(),
            topRightY = Math.floor(lineDo.boundingBox[1].y.toDouble()).toInt(),
            bottomLeftX = Math.floor(lineDo.boundingBox[2].x.toDouble()).toInt(),
            bottomLeftY = Math.floor(lineDo.boundingBox[2].y.toDouble()).toInt(),
            bottomRightX = Math.floor(lineDo.boundingBox[3].x.toDouble()).toInt(),
            bottomRightY = Math.floor(lineDo.boundingBox[3].y.toDouble()).toInt(),
            receipt = receiptDbo
        )
    }


    private fun tryExtractDate(dateAsString: String): Date? {
        val noWhitespace = dateAsString.replace(" ", "")
        val onlyDotsNoWhitespace = noWhitespace.replace(",", ".")
        val regexDDMMYYYY = Regex("^([0-3]?[0-9])\\.([0-1]?[1-9])\\.(20([0-9][0-9]))")

        val matchesFormat = onlyDotsNoWhitespace.matches(regexDDMMYYYY)
        if (matchesFormat) {
            val (days, months, years) = onlyDotsNoWhitespace.split(".").map { it.toInt() }
            val cal = Calendar.getInstance()
            cal[Calendar.YEAR] = years
            cal[Calendar.MONTH] = months - 1
            cal[Calendar.DAY_OF_MONTH] = days
            cal[Calendar.HOUR_OF_DAY] = 0
            cal[Calendar.MINUTE] = 0
            cal[Calendar.SECOND] = 0
            cal[Calendar.MILLISECOND] = 0
            return cal.time
        } else {
            return null
        }
    }
}