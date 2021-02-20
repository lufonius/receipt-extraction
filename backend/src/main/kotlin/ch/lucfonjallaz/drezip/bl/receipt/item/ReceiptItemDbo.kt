package ch.lucfonjallaz.drezip.bl.receipt.item

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

        // hmmm
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        val type: ReceiptItemType,

        @Column(nullable = false, length = 2000)
        val label: String,

        @OneToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "label_line_id")
        var labelLine: LineDbo,

        @Column(nullable = false)
        val amount: Float,

        @OneToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "amount_line_id")
        var amountLine: LineDbo,

        @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "receipt_id")
        var receipt: ReceiptDbo,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "category_id")
        var category: CategoryDbo? = null,
)