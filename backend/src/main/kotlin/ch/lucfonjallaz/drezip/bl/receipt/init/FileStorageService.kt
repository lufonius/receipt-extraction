package ch.lucfonjallaz.drezip.bl.receipt.init

import com.azure.storage.blob.BlobServiceClientBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.util.UriComponentsBuilder
import java.net.URL

@Component
class FileStorageService(
        @Value("\${app.azure-blob-storage-connection-string}") val azureBlobStorageConnectionString: String,
        @Value("\${app.azure-blob-storage-container-name}") val azureBlobStorageContainerName: String
) {
    fun uploadImage(image: ByteArray, filename: String): String {
        val storageAccount = BlobServiceClientBuilder()
                .connectionString(azureBlobStorageConnectionString)
                .buildClient()

        val container = storageAccount.getBlobContainerClient(azureBlobStorageContainerName)

        val client = container.getBlobClient(filename)
        client.upload(image.inputStream(), image.size.toLong())

        return client.blobUrl
    }
}