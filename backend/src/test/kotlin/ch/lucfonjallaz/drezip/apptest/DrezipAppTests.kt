package ch.lucfonjallaz.drezip.apptest

import ch.lucfonjallaz.drezip.BaseAppTest
import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.*
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDto
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.core.io.Resource
import org.springframework.http.*
import org.springframework.test.annotation.Commit
import org.springframework.test.context.transaction.TestTransaction
import java.util.*
import javax.persistence.EntityManager
import javax.transaction.Transactional

@Transactional
@Commit
class DrezipAppTests : BaseAppTest() {

	@Value("\${app.test.test-image-classpath-path}") private lateinit var image: Resource

	@Autowired
	private lateinit var entityManager: EntityManager

	@Test
	fun `should update a receipt`() {
		val testUserFactory = TestUserFactory(apiBaseUrl, entityManager)
		val testUser = testUserFactory.createRandomTestUser()

		val receiptDbo = createAndSaveDummyReceiptDbo(userDbo = testUser.dbo)
		TestTransaction.end()

		val currentDate = Date()
		// TODO: change validation so that changing the img url is not possible and that changing the status
		// is only in a controlled way possible
		val receiptDto = ReceiptDto(
				id = receiptDbo.id,
				imgUrl = "updated",
				status = ReceiptStatus.Done,
				angle = 50.5F,
				uploadedAt = currentDate
		)

		val request = RequestBuilder(apiBaseUrl)
				.makeRequestUserAware(testUser)
				.setMethod(HttpMethod.PUT)
				.setBody(receiptDto)
				.setPath("/api/receipt/${receiptDto.id}")
				.buildRequest()

		val restTemplate = TestRestTemplate()
		val updatedReceiptDtoResponse = restTemplate.exchange(request, ReceiptDto::class.java)

		val updatedReceiptDto = updatedReceiptDtoResponse.body ?: throw Exception("response body was empty, but it should contain the updated receipt dto")

		assertThat(updatedReceiptDto.angle).isEqualTo(50.5F)
		assertThat(updatedReceiptDto.status).isEqualTo(ReceiptStatus.Done)
		assertThat(updatedReceiptDto.imgUrl).isEqualTo("updated")
	}

	@Test
	fun `should create a new receipt item`() {
		val userFactory = TestUserFactory(apiBaseUrl, entityManager)
		val testUser = userFactory.createRandomTestUser()

		val receiptDbo = createAndSaveDummyReceiptDbo(userDbo = testUser.dbo)
		val firstLineDbo = createAndSaveDummyLineDbo(receiptDbo, userDbo = testUser.dbo)
		val secondLineDbo = createAndSaveDummyLineDbo(receiptDbo, userDbo = testUser.dbo)
		val categoryDbo = createAndSaveDummyCategoryDbo(testUser.dbo)
		TestTransaction.end()

		val receiptItemToBeSaved = ReceiptItemDto(
				receiptId = receiptDbo.id,
				label = "Bananen",
				labelLineId = firstLineDbo.id,
				price = 0.95F,
				valueLineId = secondLineDbo.id,
				categoryId = categoryDbo.id
		)

		val request = RequestBuilder(apiBaseUrl)
				.makeRequestUserAware(testUser)
				.setMethod(HttpMethod.POST)
				.setPath("/api/receipt/item")
				.setBody(receiptItemToBeSaved)
				.buildRequest()

		val restTemplate = TestRestTemplate()
		val savedReceiptItemResponse = restTemplate.exchange(request, typeRef<ReceiptItemDto>())

		val savedReceiptItem = savedReceiptItemResponse.body ?: throw Exception("did not save receipt item")

		assertThat(savedReceiptItem.id).isNotNull
		assertThat(savedReceiptItem)
				.usingRecursiveComparison()
				.ignoringFields("id")
				.isEqualTo(receiptItemToBeSaved)
	}

	@Test
	fun `happyflow - endpoint initReceipt should init a receipt and add some receipt items for a category`() {
		val happyTestCase = HappyTestCase(apiBaseUrl, entityManager)

		val receiptDto = happyTestCase.uploadAndInitReceipt(image)
		val firstLineId = receiptDto.lines?.get(0)?.id ?: throw Exception("line at index 0 not found")
		val secondLineId = receiptDto.lines?.get(1)?.id ?: throw Exception("line at index 1 not found")

		val inProgressReceiptDto = happyTestCase.startReceiptExtraction(receiptDto.id)
		happyTestCase.setTotalAndDateOfReceipt(inProgressReceiptDto)
		val receiptItemDto = happyTestCase.addReceiptItemWithCategory(firstLineId, secondLineId, receiptDto.id)
		happyTestCase.editReceiptItem(receiptItemDto)
		happyTestCase.deleteReceiptItem(receiptItemDto.id)
		happyTestCase.endReceiptExtraction(receiptDto.id)
	}

	private fun createAndSaveDummyCategoryDbo(userDbo: UserDbo): CategoryDbo {
		val dbo = createTestCategoryDbo(name = "parent", user = userDbo)
		entityManager.persist(dbo)

		return dbo
	}

	private fun createAndSaveDummyLineDbo(receiptDbo: ReceiptDbo, userDbo: UserDbo): LineDbo {
		val lineDbo = createTestLineDbo(receiptDbo, user = userDbo)
		entityManager.persist(lineDbo)
		return lineDbo
	}

	private fun createAndSaveDummyReceiptDbo(userDbo: UserDbo): ReceiptDbo {
		val receiptDbo = createTestReceiptDbo(status = ReceiptStatus.InProgress, user = userDbo)
		entityManager.persist(receiptDbo)

		return receiptDbo
	}
}

inline fun <reified T: Any> typeRef(): ParameterizedTypeReference<T> = object: ParameterizedTypeReference<T>(){}
