package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import java.util.*

fun createTestLineDbo(
        receiptDbo: ReceiptDbo,
        id: Int = 0,
        topLeftX: Int = 0,
        topLeftY: Int = 1,
        topRightX: Int = 2,
        topRightY: Int = 3,
        bottomRightX: Int = 4,
        bottomRightY: Int = 5,
        bottomLeftX: Int = 6,
        bottomLeftY: Int = 7,
        text: String = "extracted text",
) = LineDbo(
        id = id,
        topLeftX = topLeftX,
        topLeftY = topLeftY,
        topRightX = topRightX,
        topRightY = topRightY,
        bottomRightX = bottomRightX,
        bottomRightY = bottomRightY,
        bottomLeftX = bottomLeftX,
        bottomLeftY = bottomLeftY,
        text = text,
        receipt = receiptDbo
)

fun createTestCategoryDbo(
        id: Int = 0,
        name: String = "test",
        color: String = "#000000",
        avatarUrl: String = "dummyAvatarUrl"
) = CategoryDbo(
        id = id,
        avatarUrl = avatarUrl,
        color = color,
        name = name
)

fun createTestReceiptDbo(
        status: ReceiptStatus,
        id: Int = 0,
        imgUrl: String = "hoi",
        angle: Float? = null,
        total: Float? = null,
        totalLine: LineDbo? = null,
        date: Date? = null,
        dateLine: LineDbo? = null
) = ReceiptDbo(
        id = id,
        status = status,
        imgUrl = imgUrl,
        angle = angle,
        total = total,
        totalLine = totalLine,
        date = date,
        dateLine = dateLine
)

fun createTestReceiptItemDbo(
        id: Int = 0,
        labelLine: LineDbo,
        amountLine: LineDbo,
        receiptDbo: ReceiptDbo,
        categoryDbo: CategoryDbo?,
        type: ReceiptItemType = ReceiptItemType.Category,
        label: String = "testLabel",
        amount: Float = 0.95F
) = ReceiptItemDbo(
    id = id,
        labelLine = labelLine,
        amountLine = amountLine,
        receipt = receiptDbo,
        category = categoryDbo,
        type = type,
        label = label,
        amount = amount
)

