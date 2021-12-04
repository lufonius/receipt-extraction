package ch.lucfonjallaz.drezip.auth

import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
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

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var receiptItems: List<ReceiptItemDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var receipts: List<ReceiptDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var categories: List<CategoryDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
        var lines: List<LineDbo> = listOf()
)
