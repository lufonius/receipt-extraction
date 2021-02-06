package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.BaseIntegrationTest
import com.azure.storage.blob.BlobServiceClientBuilder
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import java.net.URL
import java.util.*

internal class FileStorageServiceUnitIntegrationTest : BaseIntegrationTest() {

    @Autowired lateinit var fileStorageService: FileStorageService
    @Value("\${app.azure-blob-storage-connection-string}") lateinit var azureBlobStorageConnectionString: String
    @Value("\${app.azure-blob-storage-container-name}") lateinit var azureBlobStorageContainerName: String
    @Value("\${app.test.test-image-classpath-path}") private lateinit var image: Resource

    private lateinit var uploadedFile: String

    @Test
    fun `should upload an image and return a URL for accessing the image`() {
        // given
        val imageBytes = image.file.readBytes()
        val filename = "${UUID.randomUUID()}.jpg"

        // when
        val url = fileStorageService.uploadImage(imageBytes, filename)
        uploadedFile = filename

        // then
        assertThat(url).contains(filename)
        val uploadedBytes = URL(url).readBytes()
        assertThat(uploadedBytes).isEqualTo(imageBytes)
    }

    @AfterEach
    fun deleteImages() {
        val storageAccount = BlobServiceClientBuilder()
                .connectionString(azureBlobStorageConnectionString)
                .buildClient()

        val client = storageAccount.getBlobContainerClient(azureBlobStorageContainerName).getBlobClient(uploadedFile)
        client.delete()
    }
}