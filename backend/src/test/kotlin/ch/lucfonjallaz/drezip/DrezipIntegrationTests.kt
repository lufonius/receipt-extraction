package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDto
import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDto
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemType
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.*
import org.springframework.test.annotation.Commit
import org.springframework.test.context.transaction.TestTransaction
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import java.net.URI
import java.util.*
import javax.persistence.EntityManager
import javax.transaction.Transactional

@Transactional
@Commit
class DrezipIntegrationTests : BaseIntegrationTest() {

	@Value("\${app.test.test-image-classpath-path}") private lateinit var image: Resource

	@Autowired
	private lateinit var entityManager: EntityManager

	@Test
	fun `should update a receipt`() {
		val receiptDbo = createAndSaveDummyReceiptDbo()
		val lineDbo = createAndSaveDummyLineDbo(receiptDbo)
		TestTransaction.end()

		val currentDate = Date()
		val receiptDto = ReceiptDto(
				id = receiptDbo.id,
				imgUrl = receiptDbo.imgUrl,
				status = receiptDbo.status,
				angle = 50.5F,
				total = 60.9F,
				totalLineId = lineDbo.id,
				date = currentDate,
				dateLineId = lineDbo.id
		)

		val restTemplate = TestRestTemplate()
		val receiptDtoToUpdateRequest = RequestEntity(receiptDto, HttpMethod.PUT, URI("$apiBaseUrl/api/receipt/${receiptDto.id}"))
		val updatedReceiptDtoResponse = restTemplate.exchange(receiptDtoToUpdateRequest, ReceiptDto::class.java)

		val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("response body was empty, but it should contain the updated receipt dto")

		assertThat(updatedReceiptDto.angle).isEqualTo(50.5F)
		assertThat(updatedReceiptDto.total).isEqualTo(60.9F)
		assertThat(updatedReceiptDto.totalLineId).isEqualTo(lineDbo.id)
		assertThat(updatedReceiptDto.date).isEqualTo(currentDate)
		assertThat(updatedReceiptDto.dateLineId).isEqualTo(lineDbo.id)
	}

	@Test
	fun `should create a new receipt item`() {
		val receiptDbo = createAndSaveDummyReceiptDbo()
		val firstLineDbo = createAndSaveDummyLineDbo(receiptDbo)
		val secondLineDbo = createAndSaveDummyLineDbo(receiptDbo)
		val categoryDbo = createAndSaveDummyCategoryDbo()
		TestTransaction.end()

		val receiptItemToBeSaved = ReceiptItemDto(
				receiptId = receiptDbo.id,
				type = ReceiptItemType.Category,
				label = "Bananen",
				labelLineId = firstLineDbo.id,
				amount = 0.95F,
				amountLineId = secondLineDbo.id,
				categoryId = categoryDbo.id
		)

		val restTemplate = TestRestTemplate()
		val saveReceiptItemRequest = RequestEntity<ReceiptItemDto>(receiptItemToBeSaved, HttpMethod.POST, URI("$apiBaseUrl/api/receipt/item"))
		val savedReceiptItemResponse = restTemplate.exchange(saveReceiptItemRequest, typeRef<ReceiptItemDto>())

		val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

		assertThat(savedReceiptItem.id).isNotNull
		assertThat(savedReceiptItem)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(receiptItemToBeSaved)
	}

	@Test
	fun `happyflow - endpoint initReceipt should init a receipt and add some receipt items for a category`() {
		val receiptDto = uploadAndInitReceipt()
		val firstLineId = receiptDto.lines?.get(0)?.id ?: throw Exception("line at index 0 not found")
		val secondLineId = receiptDto.lines?.get(1)?.id ?: throw Exception("line at index 1 not found")

		val inProgressReceiptDto = startReceiptExtraction(receiptDto.id)
		setTotalAndDateOfReceipt(inProgressReceiptDto, firstLineId, secondLineId)
		val receiptItemDto = addReceiptItemWithCategory(firstLineId, secondLineId, receiptDto.id)
		editReceiptItem(receiptItemDto)
		deleteReceiptItem(receiptItemDto.id)
		addReceiptItemWithTax(firstLineId, secondLineId, receiptDto.id)
		endReceiptExtraction(receiptDto.id)
	}

	private fun uploadAndInitReceipt(): ReceiptDto {
		val headers = HttpHeaders()
		headers.contentType = MediaType.MULTIPART_FORM_DATA

		// we need to have a fileSystemResource, as otherwise the request cannot be built correctly
		// fileSystemResource contains more information like file name, file location etc. which is all
		// needed to build a request
		val body: MultiValueMap<String, FileSystemResource> = LinkedMultiValueMap()
		body.add("file", FileSystemResource(image.file))

		val restTemplate = TestRestTemplate()
		val receiptDtoResponse = restTemplate.exchange("$apiBaseUrl/api/receipt/init", HttpMethod.POST, HttpEntity(body, headers), ReceiptDto::class.java)

		val receiptDto = receiptDtoResponse.body ?: throw Exception("no receipt returned of the init endpoint")

		assertThat(receiptDto.status).isEqualTo(ReceiptStatus.Open)
		assertThat(receiptDto.angle).isNotNull
		assertThat(receiptDto.imgUrl).isNotNull

		return receiptDto
	}

	private fun startReceiptExtraction(receiptId: Int): ReceiptDto {
		val restTemplate = TestRestTemplate()

		val request = RequestEntity<ReceiptDto>(HttpMethod.POST, URI("$apiBaseUrl/api/receipt/start/${receiptId}"))
		val updatedReceiptDtoResponse = restTemplate.exchange(request, ReceiptDto::class.java)

		val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("Expected a non-null response body")

		assertThat(updatedReceiptDto.id).isEqualTo(receiptId)
		assertThat(updatedReceiptDto.status).isEqualTo(ReceiptStatus.InProgress)

		return updatedReceiptDto
	}

	private fun setTotalAndDateOfReceipt(receiptDto: ReceiptDto, totalLineId: Int, dateLineId: Int) {
		val restTemplate = TestRestTemplate()
		val currentDate = Date()
		val receiptDtoToBeUpdated = receiptDto.copy(
				total = 50.5F,
				totalLineId = totalLineId,
				date = currentDate,
				dateLineId = dateLineId
		)

		val receiptDtoToUpdateRequest = RequestEntity(receiptDtoToBeUpdated, HttpMethod.PUT, URI("$apiBaseUrl/api/receipt/${receiptDto.id}"))
		val updatedReceiptDtoResponse = restTemplate.exchange(receiptDtoToUpdateRequest, ReceiptDto::class.java)

		val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("did not update receipt dto")
		assertThat(updatedReceiptDto.total).isEqualTo(50.5F)
		assertThat(updatedReceiptDto.totalLineId).isEqualTo(totalLineId)
		assertThat(updatedReceiptDto.date).isEqualTo(currentDate)
		assertThat(updatedReceiptDto.dateLineId).isEqualTo(dateLineId)
	}

	private fun addReceiptItemWithCategory(labelLineId: Int, amountLineId: Int, receiptId: Int): ReceiptItemDto {
		val restTemplate = TestRestTemplate()
		val persistedCategory = createAndSaveDummyCategoryDbo()
		TestTransaction.end()

		val getCategoriesRequest = RequestEntity<List<CategoryDto>>(HttpMethod.GET, URI("$apiBaseUrl/api/category"))
		val getCategoriesResponse = restTemplate.exchange(getCategoriesRequest, typeRef<List<CategoryDto>>())

		val categories = getCategoriesResponse.body ?: throw Exception("no categories found, but there should be at least one")
		val category = categories.firstOrNull { it.id == persistedCategory.id } ?: throw Exception("did not find category with id ${persistedCategory.id}")
		assertThat(category.name).isEqualTo("parent")

		val receiptItemToBeSaved = ReceiptItemDto(
				receiptId = receiptId,
				type = ReceiptItemType.Category,
				label = "Bananen",
				labelLineId = labelLineId,
				amount = 0.95F,
				amountLineId = amountLineId,
				categoryId = category.id
		)

		val saveReceiptItemRequest = RequestEntity<ReceiptItemDto>(receiptItemToBeSaved, HttpMethod.POST, URI("$apiBaseUrl/api/receipt/item"))
		val savedReceiptItemResponse = restTemplate.exchange(saveReceiptItemRequest, typeRef<ReceiptItemDto>())

		val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

		assertThat(savedReceiptItem.id).isNotNull
		assertThat(savedReceiptItem)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(receiptItemToBeSaved)

		return savedReceiptItem
	}

	private fun editReceiptItem(receiptItemDtoToBeEdited: ReceiptItemDto) {
		val editedReceiptItemDto = receiptItemDtoToBeEdited.copy(
				amount = 70.88F,
				label = "editedLabel"
		)

		val restTemplate = TestRestTemplate()
		val saveReceiptItemRequest = RequestEntity<ReceiptItemDto>(editedReceiptItemDto, HttpMethod.PUT, URI("$apiBaseUrl/api/receipt/item/${editedReceiptItemDto.id}"))
		val savedReceiptItemResponse = restTemplate.exchange(saveReceiptItemRequest, typeRef<ReceiptItemDto>())

		val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

		assertThat(savedReceiptItem.id).isNotNull
		assertThat(savedReceiptItem)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(editedReceiptItemDto)
	}

	private fun deleteReceiptItem(id: Int) {
		val restTemplate = TestRestTemplate()
		val saveReceiptItemRequest = RequestEntity<Unit>(HttpMethod.DELETE, URI("$apiBaseUrl/api/receipt/item/${id}"))
		restTemplate.exchange(saveReceiptItemRequest, typeRef<ReceiptItemDto>())

		val entity = entityManager.find(ReceiptItemDbo::class.java, id)
		assertThat(entity).isNull()
	}

	private fun addReceiptItemWithTax(labelLineId: Int, amountLineId: Int, receiptId: Int): ReceiptItemDto {
		val restTemplate = TestRestTemplate()
		val receiptItemToBeSaved = ReceiptItemDto(
				receiptId = receiptId,
				type = ReceiptItemType.Tax,
				label = "Tax",
				labelLineId = labelLineId,
				amount = 0.95F,
				amountLineId = amountLineId,
				categoryId = null
		)

		val saveReceiptItemRequest = RequestEntity<ReceiptItemDto>(receiptItemToBeSaved, HttpMethod.POST, URI("$apiBaseUrl/api/receipt/item"))
		val savedReceiptItemResponse = restTemplate.exchange(saveReceiptItemRequest, typeRef<ReceiptItemDto>())

		val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

		assertThat(savedReceiptItem.id).isNotNull
		assertThat(savedReceiptItem)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(receiptItemToBeSaved)

		return savedReceiptItem
	}

	private fun endReceiptExtraction(receiptId: Int) {
		val restTemplate = TestRestTemplate()

		val request = RequestEntity<ReceiptDto>(HttpMethod.POST, URI("$apiBaseUrl/api/receipt/end/${receiptId}"))
		val updatedReceiptDtoResponse = restTemplate.exchange(request, ReceiptDto::class.java)

		val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("Expected a non-null response body")

		assertThat(updatedReceiptDto.id).isEqualTo(receiptId)
		assertThat(updatedReceiptDto.status).isEqualTo(ReceiptStatus.Done)
	}

	private fun createAndSaveDummyCategoryDbo(): CategoryDbo {
		val dbo = createTestCategoryDbo(name = "parent")
		entityManager.persist(dbo)

		return dbo
	}

	private fun createAndSaveDummyLineDbo(receiptDbo: ReceiptDbo): LineDbo {
		val lineDbo = createTestLineDbo(receiptDbo)
		entityManager.persist(lineDbo)
		return lineDbo
	}

	private fun createAndSaveDummyReceiptDbo(): ReceiptDbo {
		val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.Open)
		entityManager.persist(receiptDbo)

		return receiptDbo
	}
}

inline fun <reified T: Any> typeRef(): ParameterizedTypeReference<T> = object: ParameterizedTypeReference<T>(){}
