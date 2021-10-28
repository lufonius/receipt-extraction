package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.item.ReceiptItemDbo
import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
@Table(name="receipt")
data class ReceiptDbo(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int = 0,

        // hmmm
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        val status: ReceiptStatus,

        @Column(nullable = false, length = 250)
        val imgUrl: String,

        @Column(nullable = true)
        val merchant: String? = null,

        @Column(nullable = true)
        val angle: Float? = null,

        @Column(nullable = false)
        val uploadedAt: Date,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "receipt", cascade = [CascadeType.REFRESH, CascadeType.PERSIST])
        var lines: List<LineDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "receipt", cascade = [CascadeType.REFRESH, CascadeType.PERSIST])
        var items: List<ReceiptItemDbo> = listOf()
)