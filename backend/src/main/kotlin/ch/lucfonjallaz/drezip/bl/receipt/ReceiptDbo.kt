package ch.lucfonjallaz.drezip.bl.receipt

import ch.lucfonjallaz.drezip.bl.receipt.line.LineDbo
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
        val angle: Float?,

        @OneToMany(fetch = FetchType.LAZY, targetEntity = LineDbo::class, mappedBy = "receipt")
        val lines: List<LineDbo> = listOf()
)