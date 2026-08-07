package br.com.suzanoit.qa.modules.api_testing.presentation

import br.com.suzanoit.qa.modules.api_testing.application.*
import br.com.suzanoit.qa.modules.api_testing.domain.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/api-testing")
@CrossOrigin(origins = ["*"])
class ApiTestingControllers(
    private val collectionService: ApiCollectionService,
    private val environmentService: ApiEnvironmentService,
    private val variableService: ApiVariableService,
    private val assertionService: ApiAssertionService
) {

    // Collections
    @GetMapping("/projects/{projectId}/collections")
    fun getCollections(@PathVariable projectId: String): ResponseEntity<List<ApiCollection>> {
        return ResponseEntity.ok(collectionService.getAllByProject(projectId))
    }

    @PostMapping("/collections")
    fun createCollection(@RequestBody collection: ApiCollection): ResponseEntity<ApiCollection> {
        return ResponseEntity.ok(collectionService.create(collection))
    }

    @DeleteMapping("/collections/{id}")
    fun deleteCollection(@PathVariable id: String): ResponseEntity<Void> {
        collectionService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // Environments
    @GetMapping("/projects/{projectId}/environments")
    fun getEnvironments(@PathVariable projectId: String): ResponseEntity<List<ApiEnvironment>> {
        return ResponseEntity.ok(environmentService.getAllByProject(projectId))
    }

    @PostMapping("/environments")
    fun createEnvironment(@RequestBody env: ApiEnvironment): ResponseEntity<ApiEnvironment> {
        return ResponseEntity.ok(environmentService.create(env))
    }

    @DeleteMapping("/environments/{id}")
    fun deleteEnvironment(@PathVariable id: String): ResponseEntity<Void> {
        environmentService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // Variables
    @GetMapping("/variables/{scope}/{scopeId}")
    fun getVariables(@PathVariable scope: String, @PathVariable scopeId: String): ResponseEntity<List<ApiVariable>> {
        return ResponseEntity.ok(variableService.getByScope(scope, scopeId))
    }

    @PostMapping("/variables")
    fun createVariable(@RequestBody variable: ApiVariable): ResponseEntity<ApiVariable> {
        return ResponseEntity.ok(variableService.create(variable))
    }

    @DeleteMapping("/variables/{id}")
    fun deleteVariable(@PathVariable id: String): ResponseEntity<Void> {
        variableService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // Assertions
    @GetMapping("/requests/{requestId}/assertions")
    fun getAssertions(@PathVariable requestId: String): ResponseEntity<List<ApiAssertion>> {
        return ResponseEntity.ok(assertionService.getByRequestId(requestId))
    }

    @PostMapping("/assertions")
    fun createAssertion(@RequestBody assertion: ApiAssertion): ResponseEntity<ApiAssertion> {
        return ResponseEntity.ok(assertionService.create(assertion))
    }

    @DeleteMapping("/assertions/{id}")
    fun deleteAssertion(@PathVariable id: String): ResponseEntity<Void> {
        assertionService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
