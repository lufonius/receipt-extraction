package ch.lucfonjallaz.drezip.bl.category

import javax.persistence.*

@Entity
@Table(name="category")
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

    @OneToMany(targetEntity = CategoryDbo::class, mappedBy = "parentCategoryId")
    var subCategories: List<CategoryDbo>? = null
)