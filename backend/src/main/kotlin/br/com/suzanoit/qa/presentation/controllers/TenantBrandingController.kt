package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.TenantBrandingService
import br.com.suzanoit.qa.core.domain.TenantBranding
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.UUID

@RestController
@RequestMapping("/api/v1/branding")
class TenantBrandingController(
    private val brandingService: TenantBrandingService
) {

    @GetMapping
    fun getBranding(
        @RequestHeader(value = "X-Tenant-ID", defaultValue = "default") tenantId: String
    ): ResponseEntity<TenantBranding> {
        return ResponseEntity.ok(brandingService.getBranding(tenantId))
    }

    @PutMapping
    fun updateBranding(
        @RequestHeader(value = "X-Tenant-ID", defaultValue = "default") tenantId: String,
        @RequestBody branding: TenantBranding
    ): ResponseEntity<TenantBranding> {
        return ResponseEntity.ok(brandingService.updateBranding(tenantId, branding))
    }

    @PostMapping("/upload")
    fun uploadAsset(
        @RequestHeader(value = "X-Tenant-ID", defaultValue = "default") tenantId: String,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<Map<String, String>> {
        if (file.isEmpty) {
            return ResponseEntity.badRequest().body(mapOf("error" to "Empty file"))
        }

        val uploadDir = Paths.get("data", "uploads", tenantId)
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir)
        }

        val originalFilename = file.originalFilename ?: "unknown.png"
        val extension = originalFilename.substringAfterLast('.', "png")
        val newFilename = "${UUID.randomUUID()}.$extension"
        val targetPath = uploadDir.resolve(newFilename)

        Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)

        // O frontend vai poder servir isso se tivermos um ResourceHandler, mas por ora devolvemos a rota relativa
        // No mundo real, usaríamos AWS S3 e retornaríamos a URL.
        val fileUrl = "/uploads/$tenantId/$newFilename"

        return ResponseEntity.ok(mapOf("url" to fileUrl))
    }
}
