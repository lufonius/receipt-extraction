package ch.lucfonjallaz.drezip.auth

import javax.persistence.*

@Entity
@Table(name="user")
data class UserDbo(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int = 0,

        @Column(nullable = false, length = 250)
        val username: String,

        @Column(nullable = false, length = 250)
        val password: String
)
