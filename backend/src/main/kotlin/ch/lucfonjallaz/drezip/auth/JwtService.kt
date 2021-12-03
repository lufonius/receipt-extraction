package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.PropertyService
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import java.util.*
import java.util.function.Function
import io.jsonwebtoken.security.Keys

@Component
class JwtService(val propertyService: PropertyService) {
    fun extractUsername(token: String): String = extractAllClaims(token).subject
    fun extractExpiration(token: String?): Date = extractAllClaims(token).expiration

    private fun extractAllClaims(token: String?): Claims {
        return Jwts
                .parserBuilder()
                .setSigningKey(propertyService.jwtSigningKey)
                .build()
                .parseClaimsJws(token).body
    }

    private fun isTokenExpired(token: String?): Boolean {
        return extractExpiration(token).before(Date())
    }

    fun generateToken(userDetails: UserDetails): String {
        val claims: Map<String, Any?> = HashMap()
        return createToken(claims, userDetails.username)
    }

    private fun createToken(claims: Map<String, Any?>, subject: String): String {
        val key = Keys.hmacShaKeyFor(propertyService.jwtSigningKey.toByteArray())

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(Date(System.currentTimeMillis()))
                .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(key, SignatureAlgorithm.HS256).compact()
    }

    fun validateToken(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return username == userDetails.username && !isTokenExpired(token)
    }
}