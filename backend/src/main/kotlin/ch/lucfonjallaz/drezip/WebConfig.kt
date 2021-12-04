package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.auth.UserIdResolver
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(val userIdResolver: UserIdResolver) : WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(userIdResolver)
        super.addArgumentResolvers(resolvers)
    }
}