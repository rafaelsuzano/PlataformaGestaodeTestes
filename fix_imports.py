import os
import glob

files = [
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/presentation/PlatformSettingsController.kt",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/tenant/application/TenantBrandingService.kt",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/RepositoryImpls.kt",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/tenant/infrastructure/TenantBrandingRepositoryImpl.kt"
]

for file in files:
    if os.path.exists(file):
        content = open(file).read()
        content = content.replace("import br.com.suzanoit.qa.modules.projects.domain.EnvironmentRepository", "import br.com.suzanoit.qa.modules.shared.domain.EnvironmentRepository")
        content = content.replace("import br.com.suzanoit.qa.modules.executions.domain.ExecutionHistoryRepository", "import br.com.suzanoit.qa.modules.shared.domain.ExecutionHistoryRepository")
        content = content.replace("import br.com.suzanoit.qa.modules.audit.domain.SystemLogRepository", "import br.com.suzanoit.qa.modules.shared.domain.SystemLogRepository")
        content = content.replace("import br.com.suzanoit.qa.modules.core.domain.CategoryRepository", "import br.com.suzanoit.qa.modules.shared.domain.CategoryRepository")
        content = content.replace("import br.com.suzanoit.qa.modules.core.domain.ModuleRepository", "import br.com.suzanoit.qa.modules.shared.domain.ModuleRepository")
        content = content.replace("import br.com.suzanoit.qa.modules.tenant.domain.TenantBrandingRepository", "import br.com.suzanoit.qa.modules.shared.domain.TenantBrandingRepository")
        
        # Add shared.domain imports if they are missing
        if "import br.com.suzanoit.qa.modules.shared.domain.*" not in content:
            content = content.replace("package ", "package ")
            content = content + "\nimport br.com.suzanoit.qa.modules.shared.domain.*\n"
            
        open(file, 'w').write(content)

