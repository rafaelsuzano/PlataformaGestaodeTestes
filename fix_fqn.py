import os

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/RepositoryImpls.kt"

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
    
    "SystemLogJpaEntity": "audit",
    "SystemLogJpaRepository": "audit",
}

with open(filepath, "r") as f:
    content = f.read()

for cls, module in mapping.items():
    old_fqn = f"br.com.suzanoit.qa.modules.shared.infrastructure.jpa.{cls}"
    new_fqn = f"br.com.suzanoit.qa.modules.{module}.infrastructure.jpa.{cls}"
    content = content.replace(old_fqn, new_fqn)

with open(filepath, "w") as f:
    f.write(content)

print("Fixed fully qualified names in RepositoryImpls.kt")
