package ch.lucfonjallaz.drezip

import ch.lucfonjallaz.drezip.auth.jwt.JwtFilter
import ch.lucfonjallaz.drezip.auth.UserService

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity

import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@EnableWebSecurity
class SecurityConfiguration(
        val userService: UserService,
        val jwtFilter: JwtFilter
) : WebSecurityConfigurerAdapter() {

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userService)
    }

    override fun configure(http: HttpSecurity) {

        http
        .csrf().disable()
        .httpBasic().disable()
        .formLogin().disable()
        .logout().disable()
        .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
        .authorizeRequests()
            .antMatchers("/login").permitAll()
            .antMatchers("/register").permitAll()
            // that is not a security issue, because in our container, we only expose port 8080
            // so the actuator metric endpoints are not callable from the outside, since we host
            // these endpoints on port 9000
            .antMatchers("/actuator/**").permitAll()
            .antMatchers("**")
            .authenticated()

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter::class.java)
    }
}