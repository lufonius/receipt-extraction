package ch.lucfonjallaz.drezip.bl.category

import javax.persistence.*

@Entity
@Table(name="category")
data class CategoryDbo (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @Column(nullable = false, length = 250)
    val avatarUrl: String,

    @Column(nullable = false, length = 7)
    val color: String,

    @Column(nullable = false, length = 250)
    val name: String,

    @Column(nullable = true)
    val parentCategoryId: Int,

    @OneToMany(targetEntity = CategoryDbo::class, mappedBy = "parentCategoryId")
    val subCategories: List<CategoryDbo>
)