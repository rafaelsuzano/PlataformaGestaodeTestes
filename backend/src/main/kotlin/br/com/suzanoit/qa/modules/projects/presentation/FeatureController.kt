package br.com.suzanoit.qa.modules.projects.presentation


import br.com.suzanoit.qa.modules.projects.application.FeatureService
import br.com.suzanoit.qa.modules.projects.presentation.dto.CreateFeatureRequest
import br.com.suzanoit.qa.modules.projects.presentation.dto.FeatureResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/features")
@CrossOrigin(origins = ["*"])
class FeatureController(private val featureService: FeatureService) {

    @GetMapping
    fun getAllFeatures(): ResponseEntity<List<FeatureResponse>> {
        return ResponseEntity.ok(featureService.getAllFeatures())
    }

    @GetMapping("/{id}")
    fun getFeature(@PathVariable id: String): ResponseEntity<FeatureResponse> {
        return ResponseEntity.ok(featureService.getFeature(id))
    }

    @PostMapping
    fun createFeature(@RequestBody request: CreateFeatureRequest): ResponseEntity<FeatureResponse> {
        return ResponseEntity.status(HttpStatus.CREATED).body(featureService.createFeature(request))
    }

    @DeleteMapping("/{id}")
    fun deleteFeature(@PathVariable id: String): ResponseEntity<Void> {
        featureService.deleteFeature(id)
        return ResponseEntity.noContent().build()
    }
}