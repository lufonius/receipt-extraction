package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import java.time.LocalDateTime
import java.util.*
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
        val password: String,

        @Column(nullable = false, length = 250)
        val email: String,

        @Column(nullable = false)
        val registrationConfirmed: Boolean,

        @Column(nullable = true, length = 250)
        val registrationConfirmationCode: String,

        @Column(nullable = false)
        val registeredAt: LocalDateTime,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var receiptItems: List<ReceiptItemDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var receipts: List<ReceiptDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var categories: List<CategoryDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var lines: List<LineDbo> = listOf()
)
