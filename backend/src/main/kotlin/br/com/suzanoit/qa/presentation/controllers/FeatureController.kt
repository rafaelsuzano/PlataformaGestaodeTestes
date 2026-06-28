package br.com.suzanoit.qa.presentation.controllers

import br.com.suzanoit.qa.application.usecases.FeatureService
import br.com.suzanoit.qa.core.domain.Feature
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = ["*"])
class FeatureController(private val featureService: FeatureService) {

    @GetMapping
    fun getAllFeatures(): List<Feature> = featureService.getAllFeatures()

    @GetMapping("/{id}")
    fun getFeature(@PathVariable id: String): ResponseEntity<Feature> {
        val feature = featureService.getFeature(id)
        return if (feature != null) ResponseEntity.ok(feature) else ResponseEntity.notFound().build()
    }

    @PostMapping
    fun createFeature(@RequestBody feature: Feature): Feature = featureService.createFeature(feature)

    @DeleteMapping("/{id}")
    fun deleteFeature(@PathVariable id: String): ResponseEntity<Void> {
        featureService.deleteFeature(id)
        return ResponseEntity.noContent().build()
    }
}
