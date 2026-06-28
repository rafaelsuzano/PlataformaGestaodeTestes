package br.com.suzanoit.qa.presentation.controllers

import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException

import br.com.suzanoit.qa.application.usecases.ApiExecutionService
import br.com.suzanoit.qa.core.domain.ApiTestExecution
import br.com.suzanoit.qa.core.domain.ApiTestPlan
import br.com.suzanoit.qa.core.domain.ApiTestRequest

@RestController
@RequestMapping("/api/tester")
@CrossOrigin(origins = ["*"])
class ApiTesterController(private val service: ApiExecutionService) {

    private val restTemplate = RestTemplate()

    @PostMapping("/execute")
    fun executeRequest(@RequestBody payload: ApiTesterRequest): ResponseEntity<Map<String, Any>> {
        val startTime = System.currentTimeMillis()
        val headers = HttpHeaders()
        payload.headers.forEach { (k, v) -> headers.add(k, v) }

        val httpEntity = HttpEntity(if (payload.body.isNullOrEmpty()) null else payload.body, headers)
        val method = HttpMethod.valueOf(payload.method.uppercase())

        val result = mutableMapOf<String, Any>()

        try {
            val response = restTemplate.exchange(payload.url, method, httpEntity, String::class.java)
            result["status"] = response.statusCode.value()
            result["headers"] = response.headers.toSingleValueMap()
            result["body"] = response.body ?: ""
        } catch (e: HttpClientErrorException) {
            result["status"] = e.statusCode.value()
            result["headers"] = e.responseHeaders?.toSingleValueMap() ?: emptyMap<String, String>()
            result["body"] = e.responseBodyAsString
        } catch (e: HttpServerErrorException) {
            result["status"] = e.statusCode.value()
            result["headers"] = e.responseHeaders?.toSingleValueMap() ?: emptyMap<String, String>()
            result["body"] = e.responseBodyAsString
        } catch (e: Exception) {
            result["status"] = 500
            result["body"] = e.message ?: "Erro interno ao executar a requisição."
        }

        val endTime = System.currentTimeMillis()
        result["timeMs"] = endTime - startTime

        return ResponseEntity.ok(result)
    }

    @GetMapping("/plans")
    fun getAllPlans(): ResponseEntity<List<ApiTestPlan>> {
        return ResponseEntity.ok(service.getAllPlans())
    }

    @PostMapping("/plans")
    fun createPlan(@RequestBody plan: ApiTestPlan): ResponseEntity<ApiTestPlan> {
        return ResponseEntity.ok(service.createPlan(plan))
    }

    @PostMapping("/plans/{id}/requests")
    fun addRequest(@PathVariable id: String, @RequestBody request: ApiTestRequest): ResponseEntity<ApiTestRequest> {
        return ResponseEntity.ok(service.addRequestToPlan(request.copy(planId = id)))
    }

    @DeleteMapping("/plans/{id}")
    fun deletePlan(@PathVariable id: String): ResponseEntity<Void> {
        service.deletePlan(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/plans/{id}/execute")
    fun executePlan(@PathVariable id: String): ResponseEntity<ApiTestExecution> {
        return ResponseEntity.ok(service.executePlan(id))
    }

    @GetMapping("/executions/recent")
    fun getRecentExecutions(): ResponseEntity<List<ApiTestExecution>> {
        return ResponseEntity.ok(service.getRecentExecutions())
    }
}

data class ApiTesterRequest(
    val url: String,
    val method: String,
    val headers: Map<String, String> = emptyMap(),
    val body: String? = null
)
