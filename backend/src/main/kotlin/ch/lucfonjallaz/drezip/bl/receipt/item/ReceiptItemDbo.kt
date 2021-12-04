package ch.lucfonjallaz.drezip.bl.receipt.item

import ch.lucfonjallaz.drezip.auth.UserDbo
import ch.lucfonjallaz.drezip.bl.category.CategoryDbo
import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import javax.persistence.*

@Entity
@Table(name = "receipt_item")
data class ReceiptItemDbo(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int = 0,

        @Column(nullable = true, length = 2000)
        var label: String? = null,

        @OneToOne(fetch = FetchType.LAZY, optional = true, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "label_line_id")
        var labelLine: LineDbo? = null,

        @Column(nullable = true)
        val price: Float? = null,

        @ManyToOne(targetEntity = UserDbo::class, optional = false, fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id")
        val user: UserDbo,

        @OneToOne(fetch = FetchType.LAZY, optional = true, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "value_line_id")
        var valueLine: LineDbo? = null,

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "receipt_id")
        var receipt: ReceiptDbo,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "category_id")
        var category: CategoryDbo? = null,
)