package ch.lucfonjallaz.drezip.auth

import org.springframework.security.core.GrantedAuthority

class UserDetailsAdapter(val userDbo: UserDbo) : CustomUser {
    override fun getAuthorities(): MutableCollection<GrantedAuthority> {
        return mutableListOf()
    }

    override fun getId() = userDbo.id

    override fun getPassword(): String {
        return userDbo.password
    }

    override fun getUsername(): String {
        return userDbo.username
    }

    override fun isAccountNonExpired(): Boolean {
        return true
    }

    override fun isAccountNonLocked(): Boolean {
        return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }
}