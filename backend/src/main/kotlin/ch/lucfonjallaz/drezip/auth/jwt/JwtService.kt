package ch.lucfonjallaz.drezip.auth.jwt

import ch.lucfonjallaz.drezip.auth.CustomUser
import ch.lucfonjallaz.drezip.core.PropertyService
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import io.jsonwebtoken.security.Keys

@Component
class JwtService(val propertyService: PropertyService) {
    fun extractAllClaimsIfNotExpired(token: String?): Claims {
        return Jwts
                .parserBuilder()
                .setSigningKey(propertyService.jwtSigningKey)
                .build()
                .parseClaimsJws(token).body
    }

    fun generateToken(user: CustomUser, expiresAt: Date): String {
        val claims: Map<String, Any?> = hashMapOf("registrationConfirmed" to user.registrationConfirmed)
        return createToken(claims, user.username, expiresAt)
    }

    private fun createToken(claims: Map<String, Any?>, subject: String, expiresAt: Date): String {
        val key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(propertyService.jwtSigningKey.toByteArray()))

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(Date(System.currentTimeMillis()))
                .setExpiration(expiresAt)
                .signWith(key, SignatureAlgorithm.HS256).compact()
    }
}