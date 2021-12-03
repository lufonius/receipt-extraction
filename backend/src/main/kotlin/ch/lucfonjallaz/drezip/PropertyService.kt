package ch.lucfonjallaz.drezip

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class PropertyService(
        @Value("\${app.form-recognizer-url}") val formRecognizerUrl: String,
        @Value("\${app.form-recognizer-key}") val formRecognizerKey: String,

        @Value("\${app.azure-blob-storage-connection-string}") val azureBlobStorageConnectionString: String,
        @Value("\${app.azure-blob-storage-container-name}") val azureBlobStorageContainerName: String,

        @Value("\${app.auth.sendgrid-api-key}") val sendgridApiKey: String,
        @Value("\${app.auth.registration-email-template-id}") val sendgridRegistrationTemplateId: String,
        @Value("\${app.auth.registration-email-subject}") val registrationSubject: String,

        @Value("\${app.auth.jwt-signing-key}") val jwtSigningKey: String,

        @Value("\${app.env}") val env: String
)