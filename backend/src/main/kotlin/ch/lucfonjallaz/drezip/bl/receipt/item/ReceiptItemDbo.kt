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

        @Column(nullable = true, length = 2000)
        var label: String? = null,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "label_line_id")
        var labelLine: LineDbo? = null,

        @Column(nullable = true)
        val value: String? = null,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "value_line_id")
        var valueLine: LineDbo? = null,

        @ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = [CascadeType.PERSIST])
        @JoinColumn(name = "receipt_id")
        var receipt: ReceiptDbo,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "category_id")
        var category: CategoryDbo? = null,
)