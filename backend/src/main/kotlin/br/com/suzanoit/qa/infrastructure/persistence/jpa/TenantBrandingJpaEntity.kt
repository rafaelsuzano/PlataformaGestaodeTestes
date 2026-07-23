package br.com.suzanoit.qa.infrastructure.persistence.jpa

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "tenant_branding")
class TenantBrandingJpaEntity(
    @Id
    val id: String = UUID.randomUUID().toString(),

    @Column(name = "tenant_id", nullable = false, unique = true)
    val tenantId: String,

    @Column(name = "company_name")
    val companyName: String? = null,

    @Column(name = "platform_name")
    val platformName: String? = null,

    @Column(name = "logo", length = 1024)
    val logo: String? = null,

    @Column(name = "logo_small", length = 1024)
    val logoSmall: String? = null,

    @Column(name = "favicon", length = 1024)
    val favicon: String? = null,

    @Column(name = "background_image", length = 1024)
    val backgroundImage: String? = null,

    @Column(name = "primary_color", length = 50)
    val primaryColor: String? = null,

    @Column(name = "secondary_color", length = 50)
    val secondaryColor: String? = null,

    @Column(name = "accent_color", length = 50)
    val accentColor: String? = null,

    @Column(name = "menu_color", length = 50)
    val menuColor: String? = null,

    @Column(name = "header_color", length = 50)
    val headerColor: String? = null,

    @Column(name = "background_color", length = 50)
    val backgroundColor: String? = null,

    @Column(name = "button_color", length = 50)
    val buttonColor: String? = null,

    @Column(name = "font", length = 100)
    val font: String? = null,

    @Column(name = "theme", length = 50)
    val theme: String? = null,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
