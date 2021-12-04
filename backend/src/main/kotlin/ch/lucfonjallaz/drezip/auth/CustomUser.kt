package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.userdetails.UserDetails

interface CustomUser : UserDetails {
    fun getId(): Int
}