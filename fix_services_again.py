import os

files_to_fix = {
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/users/application/UserService.kt": "import br.com.suzanoit.qa.modules.users.infrastructure.*\n",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/auth/application/AuthService.kt": "import br.com.suzanoit.qa.modules.users.infrastructure.*\n",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/automation/application/AutomationService.kt": "import br.com.suzanoit.qa.modules.automation.infrastructure.*\n",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/integrations/application/IntegrationService.kt": "import br.com.suzanoit.qa.modules.integrations.infrastructure.*\n",
    "backend/src/main/kotlin/br/com/suzanoit/qa/modules/projects/application/SprintService.kt": "import br.com.suzanoit.qa.modules.projects.infrastructure.*\n"
}

for filepath, import_stmt in files_to_fix.items():
    if os.path.exists(filepath):
        content = open(filepath).read()
        parts = content.split("\n", 1)
        content = parts[0] + "\n" + import_stmt + parts[1]
        open(filepath, 'w').write(content)

