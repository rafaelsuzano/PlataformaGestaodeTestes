import os
import glob
import re

base_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules"

mapping = {
    "ProjectJpaEntity": "projects",
    "SprintJpaEntity": "projects",
    "ModuleJpaEntity": "projects",
    "CategoryJpaEntity": "projects",
    "RequirementJpaEntity": "projects",
    "FeatureJpaEntity": "projects",
    "EnvironmentJpaEntity": "projects",
    "ProjectJpaRepository": "projects",
    "SprintJpaRepository": "projects",
    "ModuleJpaRepository": "projects",
    "CategoryJpaRepository": "projects",
    "RequirementJpaRepository": "projects",
    "FeatureJpaRepository": "projects",
    "EnvironmentJpaRepository": "projects",
    
    "TestCaseFolderJpaEntity": "core",
    "TestCaseJpaEntity": "core",
    "TestStepJpaEntity": "core",
    "DefectJpaEntity": "core",
    "TestCaseFolderJpaRepository": "core",
    "TestCaseJpaRepository": "core",
    "TestStepJpaRepository": "core",
    "DefectJpaRepository": "core",

    "TestExecutionJpaEntity": "executions",
    "TestExecutionStepJpaEntity": "executions",
    "TestPlanJpaEntity": "executions",
    "ExecutionHistoryJpaEntity": "executions",
    "TestExecutionJpaRepository": "executions",
    "TestExecutionStepJpaRepository": "executions",
    "TestPlanJpaRepository": "executions",
    "ExecutionHistoryJpaRepository": "executions",

    "UserJpaEntity": "users",
    "UserProjectJpaEntity": "users",
    "UserProjectId": "users",
    
    "SystemLogJpaEntity": "audit",
    "SystemLogJpaRepository": "audit",
    
    "IntegrationConfigJpaEntity": "integrations",
    
    "ApiTestPlanJpaEntity": "api_testing",
    "ApiTestRequestJpaEntity": "api_testing",
    "ApiTestExecutionJpaEntity": "api_testing",
}

for root, _, files in os.walk(base_path):
    for file in files:
        if file.endswith(".kt"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                content = f.read()
            
            original = content
            for cls, module in mapping.items():
                old_import = f"import br.com.suzanoit.qa.modules.shared.infrastructure.jpa.{cls}"
                new_import = f"import br.com.suzanoit.qa.modules.{module}.infrastructure.jpa.{cls}"
                content = content.replace(old_import, new_import)
            
            # Wildcard imports
            if "import br.com.suzanoit.qa.modules.shared.infrastructure.jpa.*" in content:
                # Add all new imports and remove the old wildcard
                # This is a bit brute force, but it's safe.
                content = content.replace("import br.com.suzanoit.qa.modules.shared.infrastructure.jpa.*", 
                    "import br.com.suzanoit.qa.modules.projects.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.core.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.executions.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.users.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.audit.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.integrations.infrastructure.jpa.*\n"
                    "import br.com.suzanoit.qa.modules.api_testing.infrastructure.jpa.*"
                )
            
            if content != original:
                with open(filepath, "w") as f:
                    f.write(content)
                print(f"Updated imports in {filepath}")
