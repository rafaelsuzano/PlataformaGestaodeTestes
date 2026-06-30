package br.com.suzanoit.qa.application.usecases

import br.com.suzanoit.qa.core.domain.ApiTestExecution
import br.com.suzanoit.qa.core.domain.ApiTestPlan
import br.com.suzanoit.qa.core.domain.ApiTestRequest
import br.com.suzanoit.qa.infrastructure.persistence.jpa.*
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.boot.json.JsonParserFactory
import java.time.LocalDateTime

@Service
class ApiExecutionService(
    private val planRepository: ApiTestPlanRepository,
    private val requestRepository: ApiTestRequestRepository,
    private val executionRepository: ApiTestExecutionRepository,
    private val testExecutionRepository: TestExecutionJpaRepository
) {
    private val restTemplate = RestTemplate()

    fun getAllPlans(): List<ApiTestPlan> {
        return planRepository.findAll().map { plan ->
            val reqs = requestRepository.findByPlanId(plan.id).map { req ->
                ApiTestRequest(req.id, req.planId, req.name, req.method, req.url, req.headers, req.body, req.expectedStatus, req.createdAt, req.updatedAt)
            }
            ApiTestPlan(plan.id, plan.name, plan.description, plan.projectId, plan.testCaseId, reqs, plan.createdAt, plan.updatedAt)
        }
    }

    @Transactional
    fun createPlan(plan: ApiTestPlan): ApiTestPlan {
        val saved = planRepository.save(ApiTestPlanJpaEntity(plan.id, plan.name, plan.description, plan.projectId, plan.testCaseId, plan.createdAt, plan.updatedAt))
        return plan.copy(id = saved.id)
    }

    @Transactional
    fun addRequestToPlan(request: ApiTestRequest): ApiTestRequest {
        val saved = requestRepository.save(ApiTestRequestJpaEntity(request.id, request.planId, request.name, request.method, request.url, request.headers, request.body, request.expectedStatus, request.createdAt, request.updatedAt))
        return request.copy(id = saved.id)
    }

    @Transactional
    fun deletePlan(id: String) {
        requestRepository.findByPlanId(id).forEach { requestRepository.delete(it) }
        planRepository.deleteById(id)
    }

    @Transactional
    fun executePlan(planId: String): ApiTestExecution {
        val requests = requestRepository.findByPlanId(planId)
        if (requests.isEmpty()) {
            return saveExecution(planId, "PASSED", 0, 100.0)
        }

        val startTime = System.currentTimeMillis()
        var passedCount = 0

        for (req in requests) {
            val headers = HttpHeaders()
            if (!req.headers.isNullOrEmpty()) {
                try {
                    val parser = JsonParserFactory.getJsonParser()
                    val jsonMap = parser.parseMap(req.headers)
                    jsonMap.forEach { (k, v) -> headers.add(k, v.toString()) }
                } catch (e: Exception) {}
            }

            val httpEntity = HttpEntity(if (req.body.isNullOrEmpty()) null else req.body, headers)
            val method = HttpMethod.valueOf(req.method.uppercase())

            var status = 0
            try {
                val response = restTemplate.exchange(req.url, method, httpEntity, String::class.java)
                status = response.statusCode.value()
            } catch (e: HttpClientErrorException) {
                status = e.statusCode.value()
            } catch (e: HttpServerErrorException) {
                status = e.statusCode.value()
            } catch (e: Exception) {
                status = 500
            }

            if (status == req.expectedStatus) {
                passedCount++
            }
        }

        val executionTime = System.currentTimeMillis() - startTime
        val successRate = (passedCount.toDouble() / requests.size) * 100
        val finalStatus = if (successRate == 100.0) "PASSED" else "FAILED"

        return saveExecution(planId, finalStatus, executionTime, successRate)
    }

    private fun saveExecution(planId: String, status: String, time: Long, rate: Double): ApiTestExecution {
        val entity = ApiTestExecutionJpaEntity(java.util.UUID.randomUUID().toString(), planId, status, time, rate, LocalDateTime.now())
        val saved = executionRepository.save(entity)
        
        // Se este plano estiver vinculado a um Caso de Teste, registre uma Execução Global para a Rastreabilidade
        val planEntity = planRepository.findById(planId)
        if (planEntity.isPresent && !planEntity.get().testCaseId.isNullOrEmpty()) {
            val tcId = planEntity.get().testCaseId!!
            val globalExec = TestExecutionJpaEntity(
                java.util.UUID.randomUUID().toString(),
                "API Execution: ${planEntity.get().name}",
                null, // sprint
                tcId,
                planId, // testPlanId
                null, // testerId
                "API", // environment
                status,
                LocalDateTime.now(), // startedAt
                LocalDateTime.now(), // completedAt
                LocalDateTime.now(), // createdAt
                LocalDateTime.now()  // updatedAt
            )
            testExecutionRepository.save(globalExec)
        }

        return ApiTestExecution(saved.id, saved.planId, saved.status, saved.executionTimeMs, saved.successRate, saved.createdAt)
    }

    fun getRecentExecutions(): List<ApiTestExecution> {
        return executionRepository.findTop5ByOrderByCreatedAtDesc().map {
            ApiTestExecution(it.id, it.planId, it.status, it.executionTimeMs, it.successRate, it.createdAt)
        }
    }
}
