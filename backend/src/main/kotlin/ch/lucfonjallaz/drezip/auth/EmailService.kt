package ch.lucfonjallaz.drezip.auth

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import com.sendgrid.*
import com.sendgrid.helpers.mail.Mail
import com.sendgrid.helpers.mail.objects.Email
import com.sendgrid.helpers.mail.objects.Personalization
import java.io.IOException


@Component
class EmailService(
        @Value("\${app.auth.sendgrid-api-key}") val sendgridApiKey: String,
        @Value("\${app.auth.registration-email-template-id}") val sendgridRegistrationTemplateId: String,
        @Value("\${app.auth.registration-email-subject}") val registrationSubject: String
) {
    val sendgrid = SendGrid(sendgridApiKey)

    fun sendRegistrationConfirmationEmail(
            username: String,
            receipient: String,
            link: String
    ) {
        val from = Email("fonjallaz97@gmail.com")
        val mail = Mail()
        mail.setFrom(from)
        mail.setTemplateId(sendgridRegistrationTemplateId)
        val personalization = Personalization()
        personalization.addDynamicTemplateData("username", username)
        personalization.addDynamicTemplateData("accountActivationLink", link)
        personalization.addTo(Email(receipient))
        personalization.subject = registrationSubject
        mail.addPersonalization(personalization)

        val sg = SendGrid(sendgridApiKey)
        val request = Request()
        try {
            request.method = Method.POST
            request.endpoint = "mail/send"
            request.body = mail.build()
            val response = sg.api(request)
            System.out.println(response.statusCode)
            System.out.println(response.body)
            System.out.println(response.headers)
        } catch (ex: IOException) {
            throw ex
        }
    }
}