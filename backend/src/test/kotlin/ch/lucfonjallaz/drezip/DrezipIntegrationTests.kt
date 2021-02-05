package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDto
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptStatus
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap

class DrezipIntegrationTests : BaseIntegrationTest() {

	@Value("\${app.test.test-image-classpath-path}") private lateinit var image: Resource

	@Test
	fun `endpoint initReceipt should init a receipt`() {
		val headers = HttpHeaders()
		headers.contentType = MediaType.MULTIPART_FORM_DATA

		// we need to have a fileSystemResource, as otherwise the request cannot be built correctly
		// fileSystemResource contains more information like file name, file location etc. which is all
		// needed to build a request
		val body: MultiValueMap<String, FileSystemResource> = LinkedMultiValueMap()
		body.add("file", FileSystemResource(image.file))

		val restTemplate = TestRestTemplate()
		val receiptDto = restTemplate.exchange("http://localhost:$port/api/initReceipt", HttpMethod.POST, HttpEntity(body, headers), ReceiptDto::class.java)

		assertThat(receiptDto.body?.status).isEqualTo(ReceiptStatus.TextExtracted)
		assertThat(receiptDto.body?.angle).isGreaterThan(0F)
		assertThat(receiptDto.body?.imgUrl).isNotNull
		assertThat(receiptDto.body?.lines).isNotEmpty
	}
}
