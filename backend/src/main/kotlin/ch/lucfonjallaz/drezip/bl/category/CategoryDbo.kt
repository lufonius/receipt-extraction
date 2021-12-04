package ch.lucfonjallaz.drezip.bl.category

import ch.lucfonjallaz.drezip.auth.UserDbo
import org.hibernate.annotations.*
import javax.persistence.*
import javax.persistence.Entity
import javax.persistence.Table

@Entity
@Table(name="category")
@SQLDelete(sql = "UPDATE category SET deleted = true WHERE id=?")
data class CategoryDbo (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false, length = 250)
    val avatarUrl: String,

    @Column(nullable = false, length = 7)
    val color: Int,

    @Column(nullable = false, length = 250)
    val name: String,

    @Column(nullable = true)
    val parentCategoryId: Int? = null,

    @Column(nullable = false)
    val deleted: Boolean = false,

    @ManyToOne(targetEntity = UserDbo::class, optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: UserDbo,

    @OneToMany(targetEntity = CategoryDbo::class, mappedBy = "parentCategoryId")
    var subCategories: List<CategoryDbo>? = null
)