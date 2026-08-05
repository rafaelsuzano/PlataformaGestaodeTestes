import os
import shutil
import re
from pathlib import Path

# Base paths
ROOT_DIR = Path("backend/src/main/kotlin/br/com/suzanoit/qa")

# File to module mapping
MODULE_MAP = {
    # Projects
    "ProjectService.kt": "projects.application",
    "SprintService.kt": "projects.application",
    "RequirementService.kt": "projects.application",
    "FeatureService.kt": "projects.application",
    "EnvironmentService.kt": "projects.application",
    "ProjectController.kt": "projects.presentation",
    "SprintController.kt": "projects.presentation",
    "RequirementController.kt": "projects.presentation",
    "FeatureController.kt": "projects.presentation",
    "EnvironmentController.kt": "projects.presentation",
    "SprintRepository.kt": "projects.infrastructure",

    # Core
    "TestCaseService.kt": "core.application",
    "TestCaseFolderService.kt": "core.application",
    "DefectService.kt": "core.application",
    "TestCaseController.kt": "core.presentation",
    "TestCaseFolderController.kt": "core.presentation",
    "DefectController.kt": "core.presentation",

    # Executions
    "TestExecutionService.kt": "executions.application",
    "TestPlanService.kt": "executions.application",
    "ExecutionHistoryService.kt": "executions.application",
    "TestExecutionController.kt": "executions.presentation",
    "TestPlanController.kt": "executions.presentation",
    "ExecutionHistoryController.kt": "executions.presentation",

    # Users / Auth
    "UserService.kt": "users.application",
    "UserController.kt": "users.presentation",
    "UserRepository.kt": "users.infrastructure",

    # Tenant
    "TenantBrandingService.kt": "tenant.application",
    "TenantBrandingController.kt": "tenant.presentation",
    "TenantBrandingJpaEntity.kt": "tenant.infrastructure",
    "TenantBrandingJpaRepository.kt": "tenant.infrastructure",
    "TenantBrandingRepositoryImpl.kt": "tenant.infrastructure",
    
    # Automation / API
    "AutomationService.kt": "automation.application",
    "AutomationIntegrationController.kt": "automation.presentation",
    "AutomationEntities.kt": "automation.infrastructure",
    "AutomationRepositories.kt": "automation.infrastructure",
    "ApiExecutionService.kt": "api_testing.application",
    "ApiTesterController.kt": "api_testing.presentation",
    "ApiTestRepositories.kt": "api_testing.infrastructure",
    
    # Integrations
    "IntegrationService.kt": "integrations.application",
    "IntegrationController.kt": "integrations.presentation",
    "IntegrationConfigRepository.kt": "integrations.infrastructure",

    # Analytics / Reports
    "MetricsService.kt": "analytics.application",
    "CoverageService.kt": "analytics.application",
    "AnalyticsControllers.kt": "analytics.presentation",

    # Audit
    "SystemLogService.kt": "audit.application",
    "SystemLogController.kt": "audit.presentation",

    # AI
    "AiService.kt": "ai.application",
    "AiController.kt": "ai.presentation",

    # Configs / Shared
    "SpaWebConfig.kt": "shared.config",
    "PlatformSettingsController.kt": "shared.presentation",
}

# Entities and Repositories are currently monolithic. We will move them to shared for now to avoid splitting 300 lines by regex in one go.
# We can refactor them in a subsequent step if needed, but for Phase 2 we just reorganize the main architecture structure.

SHARED_FILES = [
    "Entities.kt",
    "Repositories.kt",
    "MetricsDto.kt",
    "RepositoryImpls.kt",
    "JpaEntities.kt",
    "JpaRepositories.kt"
]

def main():
    # Find all kt files
    all_kt_files = list(ROOT_DIR.rglob("*.kt"))
    
    for file_path in all_kt_files:
        if file_path.name == "SuzanoItQaApplication.kt":
            continue
            
        module_path = MODULE_MAP.get(file_path.name)
        if not module_path:
            if file_path.name in SHARED_FILES:
                if "jpa" in str(file_path):
                    module_path = "shared.infrastructure.jpa"
                elif "domain" in str(file_path):
                    module_path = "shared.domain"
                else:
                    module_path = "shared.infrastructure"
            else:
                # If unmapped, put in shared
                module_path = "shared.misc"
                
        target_dir = ROOT_DIR / "modules" / module_path.replace(".", "/")
        target_dir.mkdir(parents=True, exist_ok=True)
        
        target_file = target_dir / file_path.name
        
        # Read content, change package
        content = file_path.read_text()
        
        # Determine new package name
        new_package = f"br.com.suzanoit.qa.modules.{module_path}"
        
        # Replace old package
        content = re.sub(r"^package\s+br\.com\.suzanoit\.qa\..*$", f"package {new_package}", content, flags=re.MULTILINE)
        
        # Write to new location
        target_file.write_text(content)
        
        # Remove old file
        file_path.unlink()

    # Now we need to update all imports across all files to point to the new packages.
    # But since all domain/repo stuff went to shared, we just replace their imports.
    # And we replace old usecases imports with modules.x.application imports
    
    # This is a broad stroke: replacing standard old packages with wildcards to new ones is hard.
    # We will replace exact class imports by finding their new package.
    
    new_kt_files = list((ROOT_DIR / "modules").rglob("*.kt"))
    class_to_package = {}
    for f in new_kt_files:
        content = f.read_text()
        pkg_match = re.search(r"^package\s+([\w\.]+)", content, re.MULTILINE)
        if pkg_match:
            pkg = pkg_match.group(1)
            # Find classes
            classes = re.findall(r"class\s+(\w+)|interface\s+(\w+)", content)
            for c1, c2 in classes:
                cls_name = c1 or c2
                class_to_package[cls_name] = pkg

    # Also add standard old packages to be replaced
    old_packages = [
        "br.com.suzanoit.qa.core.domain",
        "br.com.suzanoit.qa.application.usecases",
        "br.com.suzanoit.qa.infrastructure.persistence.jpa",
        "br.com.suzanoit.qa.infrastructure.persistence",
        "br.com.suzanoit.qa.presentation.controllers"
    ]
    
    for f in new_kt_files:
        content = f.read_text()
        
        # For wildcard imports like br.com.suzanoit.qa.core.domain.* -> br.com.suzanoit.qa.modules.shared.domain.*
        content = content.replace("br.com.suzanoit.qa.core.domain.*", "br.com.suzanoit.qa.modules.shared.domain.*")
        content = content.replace("br.com.suzanoit.qa.infrastructure.persistence.jpa.*", "br.com.suzanoit.qa.modules.shared.infrastructure.jpa.*")
        content = content.replace("br.com.suzanoit.qa.infrastructure.persistence.*", "br.com.suzanoit.qa.modules.shared.infrastructure.*")
        
        # Remove old specific imports and replace with new ones if we know them
        new_lines = []
        for line in content.splitlines():
            if line.startswith("import br.com.suzanoit.qa.") and not "br.com.suzanoit.qa.modules" in line:
                # Try to extract the class name
                parts = line.split(".")
                cls_name = parts[-1]
                if cls_name in class_to_package:
                    new_lines.append(f"import {class_to_package[cls_name]}.{cls_name}")
                else:
                    # Ignore or keep
                    pass
            else:
                new_lines.append(line)
                
        f.write_text("\n".join(new_lines))

    # Clean up empty old directories
    for d in ["core", "application", "infrastructure", "presentation", "config"]:
        d_path = ROOT_DIR / d
        if d_path.exists():
            shutil.rmtree(d_path)

if __name__ == "__main__":
    main()
