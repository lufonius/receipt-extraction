package ch.lucfonjallaz.drezip.bl.receipt.init

import ch.lucfonjallaz.drezip.core.PropertyService
import com.azure.core.util.Context
import com.azure.storage.blob.BlobServiceClientBuilder
import com.azure.storage.blob.models.BlobAccessPolicy
import com.azure.storage.blob.models.BlobSignedIdentifier
import com.azure.storage.blob.models.PublicAccessType
import org.springframework.stereotype.Component
import java.time.OffsetDateTime
import java.util.*

@Component
class FileStorageService(
        val propertyService: PropertyService
) {
    fun uploadImage(image: ByteArray, filename: String): String {
        val storageAccount = BlobServiceClientBuilder()
                .connectionString(propertyService.azureBlobStorageConnectionString)
                .buildClient()

        val container = storageAccount.getBlobContainerClient(propertyService.azureBlobStorageContainerName)

        // TODO: pass in directory
        if (!container.exists()) {
            container.create()
            val blobAccessPolicy = BlobAccessPolicy()
            blobAccessPolicy.permissions = "r"
            blobAccessPolicy.startsOn = OffsetDateTime.now()
            blobAccessPolicy.expiresOn = OffsetDateTime.now().plusYears(100)
            val identifier = BlobSignedIdentifier()
            identifier.accessPolicy = blobAccessPolicy
            identifier.id = UUID.randomUUID().toString()
            container.setAccessPolicyWithResponse(PublicAccessType.BLOB, listOf(identifier), null, null, Context.NONE)
        }

        val client = container.getBlobClient(filename)
        client.upload(image.inputStream(), image.size.toLong())

        return client.blobUrl
    }
}