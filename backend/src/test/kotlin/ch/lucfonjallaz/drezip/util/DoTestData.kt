package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.auth.CustomUserAdapter
import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import java.time.LocalDateTime
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
        user: UserDbo = createTestUserDbo()
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
        receipt = receiptDbo,
        user = user
)

fun createTestCategoryDbo(
        id: Int = 0,
        name: String = "test",
        color: Int = 0x000000,
        avatarUrl: String = "dummyAvatarUrl",
        user: UserDbo = createTestUserDbo()
) = CategoryDbo(
        id = id,
        avatarUrl = avatarUrl,
        color = color,
        name = name,
        user = user
)

fun createTestReceiptDbo(
        status: ReceiptStatus = ReceiptStatus.Uploaded,
        id: Int = 0,
        imgUrl: String = "hoi",
        angle: Float? = null,
        uploadedAt: Date = Date(),
        user: UserDbo = createTestUserDbo()
) = ReceiptDbo(
        id = id,
        status = status,
        imgUrl = imgUrl,
        angle = angle,
        uploadedAt = uploadedAt,
        user = user
)

fun createTestReceiptItemDbo(
        id: Int = 0,
        labelLine: LineDbo,
        priceLine: LineDbo,
        receiptDbo: ReceiptDbo,
        categoryDbo: CategoryDbo? = null,
        label: String = "testLabel",
        price: Float = 0.95F,
        user: UserDbo = createTestUserDbo()
) = ReceiptItemDbo(
    id = id,
        labelLine = labelLine,
        valueLine = priceLine,
        receipt = receiptDbo,
        category = categoryDbo,
        label = label,
        price = price,
        user = user
)

fun createTestUserDbo(
        id: Int = 0,
        username: String = "Testuser",
        password: String = "Testpassword",
        email: String = "email@test.com",
        registrationConfirmationCode: String = "123",
        registrationConfirmationCodeExpiresAt: LocalDateTime = LocalDateTime.now(),
        registrationConfirmed: Boolean = true
) = UserDbo(
        id = id,
        username = username,
        password = password,
        email = email,
        registrationConfirmationCodeExpiresAt = registrationConfirmationCodeExpiresAt,
        registrationConfirmationCode = registrationConfirmationCode,
        registrationConfirmed = registrationConfirmed
)

fun createTestCustomUser(
        id: Int = 0,
        username: String = "Testuser",
        password: String = "Testpassword",
        email: String = "email@test.com",
        registrationConfirmationCode: String = "123",
        registrationConfirmationCodeExpiresAt: LocalDateTime = LocalDateTime.now(),
        registrationConfirmed: Boolean = true
) = CustomUserAdapter(createTestUserDbo(
        id = id,
        username = username,
        password = password,
        email = email,
        registrationConfirmationCodeExpiresAt = registrationConfirmationCodeExpiresAt,
        registrationConfirmationCode = registrationConfirmationCode,
        registrationConfirmed = registrationConfirmed
))

