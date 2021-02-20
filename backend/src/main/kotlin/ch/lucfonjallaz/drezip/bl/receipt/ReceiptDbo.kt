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
        val angle: Float? = null,

        @Column(nullable = true)
        var total: Float? = null,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "total_line_id")
        var totalLine: LineDbo? = null,

        @Column(nullable = true)
        @Temporal(TemporalType.DATE)
        var date: Date? = null,

        @OneToOne(fetch = FetchType.LAZY, optional = true)
        @JoinColumn(name = "date_line_id")
        var dateLine: LineDbo? = null,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "receipt")
        var lines: List<LineDbo> = listOf(),

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "receipt")
        var items: List<ReceiptItemDbo> = listOf()
)