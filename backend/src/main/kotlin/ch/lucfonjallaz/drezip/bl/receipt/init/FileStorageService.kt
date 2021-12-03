package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.PropertyService
import com.azure.storage.blob.BlobServiceClientBuilder
import org.springframework.stereotype.Component

@Component
class FileStorageService(val propertyService: PropertyService) {
    fun uploadImage(image: ByteArray, filename: String): String {
        val storageAccount = BlobServiceClientBuilder()
                .connectionString(propertyService.azureBlobStorageConnectionString)
                .buildClient()

        val container = storageAccount.getBlobContainerClient(propertyService.azureBlobStorageContainerName)

        val client = container.getBlobClient(filename)
        client.upload(image.inputStream(), image.size.toLong())

        return client.blobUrl
    }
}