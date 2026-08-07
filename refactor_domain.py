import os
import re
import shutil

backend_src = "backend/src/main/kotlin/br/com/suzanoit/qa/modules"

# Map entity name to its new package
ENTITY_MAPPING = {
    "Project": "projects.domain",
    "Sprint": "projects.domain",
    "Requirement": "projects.domain",
    "Environment": "projects.domain",
    "Feature": "projects.domain",
    "User": "users.domain",
    "ApiTestPlan": "api_testing.domain",
    "ApiTestRequest": "api_testing.domain",
    "ApiTestExecution": "api_testing.domain",
    "Module": "core.domain",
    "Category": "core.domain",
    "TestCaseFolder": "core.domain",
    "TestCase": "core.domain",
    "TestStep": "core.domain",
    "Defect": "core.domain",
    "TestExecution": "executions.domain",
    "TestExecutionStep": "executions.domain",
    "TestPlan": "executions.domain",
    "ExecutionHistory": "executions.domain",
    "IntegrationConfig": "integrations.domain",
    "SystemLog": "audit.domain",
    "TenantBranding": "tenant.domain"
}

# 1. Read Entities.kt and split it
entities_path = os.path.join(backend_src, "shared/domain/Entities.kt")
with open(entities_path, "r") as f:
    content = f.read()

# We need to extract each data class and write to a new file
# We can just split by "data class "
classes = content.split("data class ")
header = classes[0]

for cls in classes[1:]:
    name = cls.split("(")[0].strip()
    if name in ENTITY_MAPPING:
        pkg = ENTITY_MAPPING[name]
        pkg_path = os.path.join(backend_src, pkg.replace(".", "/"))
        os.makedirs(pkg_path, exist_ok=True)
        
        file_path = os.path.join(pkg_path, f"{name}.kt")
        
        new_content = f"package br.com.suzanoit.qa.modules.{pkg}\n\n"
        new_content += "import java.time.LocalDateTime\nimport java.util.UUID\n\n"
        new_content += "data class " + cls
        
        with open(file_path, "w") as fw:
            fw.write(new_content)
        print(f"Created {file_path}")

# Delete the old Entities.kt
os.remove(entities_path)

# 2. Update all imports in all .kt files
for root, _, files in os.walk(backend_src):
    for file in files:
        if file.endswith(".kt"):
            filepath = os.path.join(root, file)
            with open(filepath, "r") as f:
                file_content = f.read()
            
            # If the file imports specific entities:
            # import br.com.suzanoit.qa.modules.shared.domain.Project
            new_file_content = file_content
            for entity, pkg in ENTITY_MAPPING.items():
                old_import = f"import br.com.suzanoit.qa.modules.shared.domain.{entity}"
                new_import = f"import br.com.suzanoit.qa.modules.{pkg}.{entity}"
                new_file_content = new_file_content.replace(old_import, new_import)
            
            # If it imports wildcard: import br.com.suzanoit.qa.modules.shared.domain.*
            if "import br.com.suzanoit.qa.modules.shared.domain.*" in new_file_content:
                # We need to figure out which entities are used in this file
                # and add their specific imports
                used_entities = []
                for entity, pkg in ENTITY_MAPPING.items():
                    # rough check if entity is used as a word
                    if re.search(r'\b' + entity + r'\b', new_file_content):
                        used_entities.append(f"import br.com.suzanoit.qa.modules.{pkg}.{entity}")
                
                # Replace wildcard with specific imports
                replacement = "\n".join(set(used_entities))
                if replacement:
                    new_file_content = new_file_content.replace("import br.com.suzanoit.qa.modules.shared.domain.*", replacement)
                else:
                    new_file_content = new_file_content.replace("import br.com.suzanoit.qa.modules.shared.domain.*\n", "")
            
            if new_file_content != file_content:
                with open(filepath, "w") as f:
                    f.write(new_file_content)
                print(f"Updated imports in {filepath}")
