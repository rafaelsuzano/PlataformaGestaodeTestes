import os
import re

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/jpa/JpaEntities.kt"

with open(filepath, "r") as f:
    content = f.read()

# Remove the ones in the constructor (which have a comma)
content = re.sub(r"\s*@TenantId @Column\(name = \"tenant_id\"\)\s+var\s+tenantId:\s*String\?\s*=\s*null,", "", content)

with open(filepath, "w") as f:
    f.write(content)

print("Cleaned up JpaEntities constructor")
