import os
import glob

# 1. Fix RepositoryImpls.kt
repo_impl_path = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/RepositoryImpls.kt"
if os.path.exists(repo_impl_path):
    lines = open(repo_impl_path).readlines()
    new_lines = []
    for line in lines:
        # If it's importing a Repository from a specific domain, change it to shared.domain
        if "Repository" in line and "import br.com.suzanoit.qa.modules." in line and not "shared.domain" in line and not "jpa" in line:
            # Replace e.g., import br.com.suzanoit.qa.modules.executions.domain.TestPlanRepository
            # with import br.com.suzanoit.qa.modules.shared.domain.TestPlanRepository
            class_name = line.strip().split(".")[-1]
            if class_name.endswith("Repository"):
                line = f"import br.com.suzanoit.qa.modules.shared.domain.{class_name}\n"
        new_lines.append(line)
    open(repo_impl_path, 'w').writelines(new_lines)

# 2. Fix DTO fully-qualified names
dto_files = glob.glob("backend/src/main/kotlin/br/com/suzanoit/qa/modules/**/presentation/dto/*.kt", recursive=True)
for file in dto_files:
    content = open(file).read()
    content = content.replace("br.com.suzanoit.qa.modules.shared.domain.Project", "br.com.suzanoit.qa.modules.projects.domain.Project")
    content = content.replace("br.com.suzanoit.qa.modules.shared.domain.Feature", "br.com.suzanoit.qa.modules.projects.domain.Feature")
    content = content.replace("br.com.suzanoit.qa.modules.shared.domain.", "br.com.suzanoit.qa.modules.core.domain.") # Catch all others if any
    open(file, 'w').write(content)

