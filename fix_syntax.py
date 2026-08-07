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
        if "\nimport br.com.suzanoit.qa.modules.shared.domain.*\n" in content:
            content = content.replace("\nimport br.com.suzanoit.qa.modules.shared.domain.*\n", "")
            # insert after package
            parts = content.split("\n", 1)
            content = parts[0] + "\nimport br.com.suzanoit.qa.modules.shared.domain.*\n" + parts[1]
            open(file, 'w').write(content)

