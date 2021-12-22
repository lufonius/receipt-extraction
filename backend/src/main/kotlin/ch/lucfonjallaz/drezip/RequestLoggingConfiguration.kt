package ch.lucfonjallaz.drezip

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.CommonsRequestLoggingFilter

@Configuration
class RequestLoggingConfiguration {
    @Bean
    fun requestLoggingFilter(): CommonsRequestLoggingFilter {
        val loggingFilter = CommonsRequestLoggingFilter()
        loggingFilter.setIncludeClientInfo(true)
        loggingFilter.setIncludeQueryString(true)
        // when uploading images, the log gets very big very fast
        // that's why we disable it here
        loggingFilter.setIncludePayload(false)
        loggingFilter.setMaxPayloadLength(64000)
        return loggingFilter
    }
}