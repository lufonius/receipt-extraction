package ch.lucfonjallaz.drezip.core

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
        @Value("\${app.auth.registration-confirmation-link}") val confirmRegistrationLink: String,
        @Value("\${app.auth.registration-link-expiry-in-mins}") val registrationLinkExpiryInMins: Int,


        @Value("\${app.env}") val env: String,
        @Value("\${app.domain}") val domain: String
)