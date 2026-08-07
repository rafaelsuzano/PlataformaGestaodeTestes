package br.com.suzanoit.qa.modules.api_testing.application.engine

import br.com.suzanoit.qa.modules.api_testing.domain.*
import br.com.suzanoit.qa.modules.api_testing.infrastructure.*
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.UUID

@Service
class ApiExecutionEngineService(
    private val requestRepository: ApiTestRequestRepository,
    private val variableRepository: ApiVariableRepository,
    private val assertionRepository: ApiAssertionRepository,
    private val resultRepository: ApiExecutionResultRepository,
    private val executionRepository: ApiTestExecutionRepository
) {
    private val restTemplate = RestTemplate()

    @Transactional
    fun executeRequest(requestId: String, environmentId: String?): ApiExecutionResult {
        // TODO: Full implementation of resolving variables, scripts, and assertions
        val request = requestRepository.findById(requestId).orElseThrow { Exception("Request not found") }
        
        val startTime = System.currentTimeMillis()
        var statusCode = 500
        var responseBody = ""
        var responseHeadersStr = ""
        
        val headers = HttpHeaders()
        // TODO: Map headers from request
        val httpEntity = HttpEntity(request.body, headers)
        val method = HttpMethod.valueOf(request.method.uppercase())
        
        try {
            val response = restTemplate.exchange(request.url, method, httpEntity, String::class.java)
            statusCode = response.statusCode.value()
            responseBody = response.body ?: ""
            responseHeadersStr = response.headers.toSingleValueMap().toString()
        } catch (e: HttpClientErrorException) {
            statusCode = e.statusCode.value()
            responseBody = e.responseBodyAsString
            responseHeadersStr = e.responseHeaders?.toSingleValueMap().toString()
        } catch (e: HttpServerErrorException) {
            statusCode = e.statusCode.value()
            responseBody = e.responseBodyAsString
            responseHeadersStr = e.responseHeaders?.toSingleValueMap().toString()
        } catch (e: Exception) {
            statusCode = 0
            responseBody = e.message ?: "Connection Error"
        }
        
        val duration = System.currentTimeMillis() - startTime
        
        // TODO: Run Assertion Engine
        val assertionsResult = "[]" // JSON Array placeholder
        
        val result = ApiExecutionResult(
            id = UUID.randomUUID().toString(),
            tenantId = request.tenantId ?: "",
            executionId = "DUMMY", // Needs a real execution context
            requestId = request.id,
            statusCode = statusCode,
            responseTimeMs = duration,
            responseBody = responseBody,
            responseHeaders = responseHeadersStr,
            assertionsResult = assertionsResult,
            createdAt = LocalDateTime.now()
        )
        
        return result
    }
}
