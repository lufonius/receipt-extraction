package ch.lucfonjallaz.drezip.apptest

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDto
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDto
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus
import ch.lucfonjallaz.drezip.bl.receipt.createTestCategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDto
import org.assertj.core.api.Assertions.assertThat
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.context.transaction.TestTransaction
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import java.util.*
import javax.persistence.EntityManager

class HappyTestCase(
    val apiBaseUrl: String,
    val entityManager: EntityManager
) {

    val testUser: TestUser

    init {
        val testUserFactory = TestUserFactory(apiBaseUrl, entityManager)
        testUser = testUserFactory.createRandomTestUser()
    }

    fun uploadAndInitReceipt(image: Resource): ReceiptDto {
        // we need to have a fileSystemResource, as otherwise the request cannot be built correctly
        // fileSystemResource contains more information like file name, file location etc. which is all
        // needed to build a request
        val body: MultiValueMap<String, FileSystemResource> = LinkedMultiValueMap()
        body.add("image", FileSystemResource(image.file))

        val request = RequestBuilder(apiBaseUrl)
            .makeRequestUserAware(testUser)
            .setMediaType(MediaType.MULTIPART_FORM_DATA)
            .setBody(body)
            .setMethod(HttpMethod.POST)
            .setPath("/api/receipt/init")
            .buildRequest()

        val restTemplate = TestRestTemplate()
        val response = restTemplate.exchange(request, ReceiptDto::class.java)

        val receiptDto = response.body ?: throw Exception("no receipt returned of the init endpoint")

        assertThat(receiptDto.status).isEqualTo(ReceiptStatus.Open)
        assertThat(receiptDto.angle).isNull()
        assertThat(receiptDto.imgUrl).isNotNull
        assertThat(receiptDto.items).isNotEmpty
        assertThat(receiptDto.lines).isNotEmpty

        return receiptDto
    }

    fun startReceiptExtraction(receiptId: Int): ReceiptDto {
        val restTemplate = TestRestTemplate()

        val request = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.POST)
                .setPath("/api/receipt/start/${receiptId}")
                .buildRequest();

        val updatedReceiptDtoResponse = restTemplate.exchange(request, ReceiptDto::class.java)

        val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("Expected a non-null response body")

        assertThat(updatedReceiptDto.id).isEqualTo(receiptId)
        assertThat(updatedReceiptDto.status).isEqualTo(ReceiptStatus.InProgress)

        return updatedReceiptDto
    }

    fun setTotalAndDateOfReceipt(receiptDto: ReceiptDto) {
        val restTemplate = TestRestTemplate()
        val newDate = Date()
        val updateReceiptDto = receiptDto.copy(
                transactionTotal = 0.95F,
                transactionDate = newDate
        )

        val request = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setBody(updateReceiptDto)
                .setMethod(HttpMethod.PUT)
                .setPath("/api/receipt/${receiptDto.id}")
                .buildRequest()

        val updateResponse = restTemplate.exchange(request, ReceiptDto::class.java).body

        assertThat(updateResponse?.transactionTotal).isEqualTo(0.95F)
        assertThat(updateResponse?.transactionDate).isEqualTo(newDate)
    }

    fun addReceiptItemWithCategory(labelLineId: Int, amountLineId: Int, receiptId: Int): ReceiptItemDto {
        val restTemplate = TestRestTemplate()
        val persistedCategory = createAndSaveDummyCategoryDbo(testUser.dbo)
        TestTransaction.end()

        val getCategoriesRequest = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.GET)
                .setPath("/api/category")
                .buildRequest()

        val getCategoriesResponse = restTemplate.exchange(getCategoriesRequest, typeRef<List<CategoryDto>>())

        val categories = getCategoriesResponse.body ?: throw Exception("no categories found, but there should be at least one")
        val category = categories.firstOrNull { it.id == persistedCategory.id } ?: throw Exception("did not find category with id ${persistedCategory.id}")
        assertThat(category.name).isEqualTo("parent")

        val receiptItemToBeSaved = ReceiptItemDto(
                receiptId = receiptId,
                label = "Bananen",
                labelLineId = labelLineId,
                price = 0.95F,
                valueLineId = amountLineId,
                categoryId = category.id
        )

        val saveItemRequest = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.POST)
                .setPath("/api/receipt/item")
                .setBody(receiptItemToBeSaved)
                .buildRequest()

        val savedReceiptItemResponse = restTemplate.exchange(saveItemRequest, typeRef<ReceiptItemDto>())

        val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

        assertThat(savedReceiptItem.id).isNotNull
        assertThat(savedReceiptItem)
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(receiptItemToBeSaved)

        return savedReceiptItem
    }

    fun editReceiptItem(receiptItemDtoToBeEdited: ReceiptItemDto) {
        val editedReceiptItemDto = receiptItemDtoToBeEdited.copy(
                price = 70.88F,
                label = "editedLabel"
        )

        val request = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.PUT)
                .setBody(editedReceiptItemDto)
                .setPath("/api/receipt/item/${editedReceiptItemDto.id}")
                .buildRequest()

        val restTemplate = TestRestTemplate()
        val savedReceiptItemResponse = restTemplate.exchange(request, typeRef<ReceiptItemDto>())

        val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

        assertThat(savedReceiptItem.id).isNotNull
        assertThat(savedReceiptItem)
                .usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(editedReceiptItemDto)
    }

    fun deleteReceiptItem(id: Int) {
        val request = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.DELETE)
                .setPath("/api/receipt/item/${id}")
                .buildRequest()

        val restTemplate = TestRestTemplate()
        restTemplate.exchange(request, typeRef<ReceiptItemDto>())

        val entity = entityManager.find(ReceiptItemDbo::class.java, id)
        assertThat(entity).isNull()
    }

    fun endReceiptExtraction(receiptId: Int) {
        val request = RequestBuilder(apiBaseUrl)
                .makeRequestUserAware(testUser)
                .setMethod(HttpMethod.POST)
                .setPath("/api/receipt/end/${receiptId}")
                .buildRequest()

        val restTemplate = TestRestTemplate()
        val updatedReceiptDtoResponse = restTemplate.exchange(request, ReceiptDto::class.java)

        val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("Expected a non-null response body")

        assertThat(updatedReceiptDto.id).isEqualTo(receiptId)
        assertThat(updatedReceiptDto.status).isEqualTo(ReceiptStatus.Done)
    }

    private fun createAndSaveDummyCategoryDbo(userDbo: UserDbo): CategoryDbo {
        val dbo = createTestCategoryDbo(name = "parent", user = userDbo)
        entityManager.persist(dbo)

        return dbo
    }
}