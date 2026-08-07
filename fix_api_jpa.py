import os

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/api_testing/application/ApiExecutionService.kt"
if os.path.exists(filepath):
    content = open(filepath).read()
    
    # Fix line 60
    old_line_60 = "ApiTestRequestJpaEntity(request.id, request.planId, request.name, request.method, request.url, request.headers, request.body, request.expectedStatus, request.createdAt, request.updatedAt)"
    new_line_60 = """ApiTestRequestJpaEntity(
            id = request.id,
            collectionId = request.collectionId,
            planId = request.planId,
            name = request.name,
            method = request.method,
            url = request.url,
            headers = request.headers,
            bodyType = request.bodyType,
            preRequestScript = request.preRequestScript,
            postResponseScript = request.postResponseScript,
            authType = request.authType,
            authConfig = request.authConfig,
            body = request.body,
            expectedStatus = request.expectedStatus,
            createdAt = request.createdAt,
            updatedAt = request.updatedAt
        )"""
    content = content.replace(old_line_60, new_line_60)
    
    # Fix line 118
    old_line_118 = "ApiTestExecutionJpaEntity(java.util.UUID.randomUUID().toString(), planId, status, time, rate, LocalDateTime.now())"
    new_line_118 = """ApiTestExecutionJpaEntity(
            id = java.util.UUID.randomUUID().toString(),
            collectionId = null,
            planId = planId,
            status = status,
            executionTimeMs = time,
            totalPassed = 0,
            totalFailed = 0,
            successRate = rate,
            createdAt = LocalDateTime.now()
        )"""
    content = content.replace(old_line_118, new_line_118)
    
    open(filepath, "w").write(content)
    print("Fixed JPA Entities constructors in ApiExecutionService.kt")

