package ch.lucfonjallaz.drezip.bl.receipt.line

import ch.lucfonjallaz.drezip.bl.receipt.ReceiptDbo
import javax.persistence.*

@Entity
@Table(name = "line")
data class LineDbo(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int = 0,

        @Column(nullable = false, name = "top_left_x")
        val topLeftX: Int,

        @Column(nullable = false, name = "top_left_y")
        val topLeftY: Int,

        @Column(nullable = false, name = "top_right_x")
        val topRightX: Int,

        @Column(nullable = false, name = "top_right_y")
        val topRightY: Int,

        @Column(nullable = false, name = "bottom_right_x")
        val bottomRightX: Int,

        @Column(nullable = false, name = "bottom_right_y")
        val bottomRightY: Int,

        @Column(nullable = false, name = "bottom_left_x")
        val bottomLeftX: Int,

        @Column(nullable = false, name = "bottom_left_y")
        val bottomLeftY: Int,

        @Column(nullable = false)
        val text: String,

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "receipt_id", nullable = false)
        val receipt: ReceiptDbo
)