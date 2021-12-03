package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.PropertyService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import com.sendgrid.*
import com.sendgrid.helpers.mail.Mail
import com.sendgrid.helpers.mail.objects.Email
import com.sendgrid.helpers.mail.objects.Personalization
import java.io.IOException


@Component
class EmailService(val propertyService: PropertyService) {
    val sendgrid = SendGrid(propertyService.sendgridApiKey)

    fun sendRegistrationConfirmationEmail(
            username: String,
            receipient: String,
            link: String
    ) {
        val from = Email("fonjallaz97@gmail.com")
        val mail = Mail()
        mail.setFrom(from)
        mail.setTemplateId(propertyService.sendgridRegistrationTemplateId)
        val personalization = Personalization()
        personalization.addDynamicTemplateData("username", username)
        personalization.addDynamicTemplateData("accountActivationLink", link)
        personalization.addTo(Email(receipient))
        personalization.subject = propertyService.registrationSubject
        mail.addPersonalization(personalization)

        val sg = SendGrid(propertyService.sendgridApiKey)
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