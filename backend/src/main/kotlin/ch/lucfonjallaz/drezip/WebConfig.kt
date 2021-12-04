package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.auth.AuthenticatedUserResolver
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(val authenticatedUserResolver: AuthenticatedUserResolver) : WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(authenticatedUserResolver)
        super.addArgumentResolvers(resolvers)
    }
}