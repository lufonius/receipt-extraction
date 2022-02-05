package ch.lucfonjallaz.drezip.auth.jwt

import ch.lucfonjallaz.drezip.auth.CustomUser
import ch.lucfonjallaz.drezip.auth.UserService
import org.springframework.security.core.context.SecurityContextHolder

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

import org.springframework.security.core.userdetails.UserDetails

import javax.servlet.FilterChain

import javax.servlet.http.HttpServletResponse

import javax.servlet.http.HttpServletRequest

import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtFilter(
        val userService: UserService,
        val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        val authorizationHeader = request.cookies?.firstOrNull { it.name == "token" }

        if (authorizationHeader != null) {
            val jwt = authorizationHeader.value
            val username = jwtService.extractUsername(jwt)

            if (username != null && SecurityContextHolder.getContext().authentication == null) {
                val userDetails: CustomUser? = userService.loadUserByUsername(username)
                if (userDetails !== null && jwtService.validateToken(jwt, userDetails)) {
                    val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.authorities
                    )
                    usernamePasswordAuthenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                    SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
                }
            }
        }

        chain.doFilter(request, response)
    }
}