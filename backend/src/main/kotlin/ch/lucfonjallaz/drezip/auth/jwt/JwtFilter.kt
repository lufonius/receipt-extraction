package ch.lucfonjallaz.drezip.auth.jwt

import ch.lucfonjallaz.drezip.auth.CustomUser
import ch.lucfonjallaz.drezip.auth.UserService
import io.jsonwebtoken.ExpiredJwtException
import org.springframework.security.core.context.SecurityContextHolder

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

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
        val jwt = extractJwt(request)
        if (jwt !== null) {
            setSecurityContext(jwt, request)
        }

        chain.doFilter(request, response)
    }

    private fun extractJwt(request: HttpServletRequest) = request.cookies?.firstOrNull { it.name == "token" }?.value

    private fun setSecurityContext(jwt: String, request: HttpServletRequest) {
        try {
            val claims = jwtService.extractAllClaimsIfNotExpired(jwt)
            if (SecurityContextHolder.getContext().authentication == null) {
                val userDetails: CustomUser = userService.loadUserByUsername(claims.subject)
                val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.authorities
                )
                usernamePasswordAuthenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
            }
        } catch (jwtExpiredException: ExpiredJwtException) {
            // we set the same max-age for the cookies, so normally this exception
            // should not occur because the browser filters out all the cookies,
            // that's why we log it. it probably means that the user is not using a regular browser
            // which is already suspicious
            logger.warn("expired jwt should not be sent by the frontend! affected jwt: $jwt")
        }
    }
}