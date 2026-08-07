import os

# Fix MetricsService.kt
metrics_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/analytics/application/MetricsService.kt"
if os.path.exists(metrics_path):
    content = open(metrics_path).read()
    content = content.replace("import br.com.suzanoit.qa.modules.shared.domain.*", "")
    content = content.replace("import br.com.suzanoit.qa.modules.core.domain.DefectDensityDto", "import br.com.suzanoit.qa.modules.shared.domain.DefectDensityDto")
    # Add imports for repositories
    content = content.replace("package br.com.suzanoit.qa.modules.analytics.application", "package br.com.suzanoit.qa.modules.analytics.application\nimport br.com.suzanoit.qa.modules.shared.domain.*")
    open(metrics_path, "w").write(content)
    print("Fixed MetricsService.kt")

# Fix AnalyticsControllers.kt
controllers_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/analytics/presentation/AnalyticsControllers.kt"
if os.path.exists(controllers_path):
    content = open(controllers_path).read()
    content = content.replace("import br.com.suzanoit.qa.modules.core.domain.DefectDensityDto", "import br.com.suzanoit.qa.modules.shared.domain.DefectDensityDto")
    if "import br.com.suzanoit.qa.modules.shared.domain.DefectDensityDto" not in content:
        content = content.replace("import br.com.suzanoit.qa.modules.shared.domain.TrendDataDto", "import br.com.suzanoit.qa.modules.shared.domain.TrendDataDto\nimport br.com.suzanoit.qa.modules.shared.domain.DefectDensityDto")
    open(controllers_path, "w").write(content)
    print("Fixed AnalyticsControllers.kt")

# Fix ApiExecutionService.kt
api_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/api_testing/application/ApiExecutionService.kt"
if os.path.exists(api_path):
    content = open(api_path).read()
    # Replace old constructors with named arguments
    content = content.replace("ApiTestRequest(req.id, req.planId, req.name, req.method, req.url, req.headers, req.body, req.expectedStatus, req.createdAt, req.updatedAt)", 
                              "ApiTestRequest(id=req.id, planId=req.planId, name=req.name, method=req.method, url=req.url, headers=req.headers, body=req.body, expectedStatus=req.expectedStatus, createdAt=req.createdAt, updatedAt=req.updatedAt)")
    
    content = content.replace("ApiTestExecution(it.id, it.planId, it.status, it.executionTimeMs, it.successRate, it.createdAt)",
                              "ApiTestExecution(id=it.id, planId=it.planId, status=it.status, executionTimeMs=it.executionTimeMs, successRate=it.successRate, createdAt=it.createdAt)")
    
    content = content.replace("ApiTestExecution(saved.id, saved.planId, saved.status, saved.executionTimeMs, saved.successRate, saved.createdAt)",
                              "ApiTestExecution(id=saved.id, planId=saved.planId, status=saved.status, executionTimeMs=saved.executionTimeMs, successRate=saved.successRate, createdAt=saved.createdAt)")
    
    open(api_path, "w").write(content)
    print("Fixed ApiExecutionService.kt")

