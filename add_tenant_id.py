import os
import re

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/jpa/JpaEntities.kt"

with open(filepath, "r") as f:
    content = f.read()

# Add import if missing
if "import org.hibernate.annotations.TenantId" not in content:
    content = content.replace("import jakarta.persistence.Id", "import jakarta.persistence.Id\nimport org.hibernate.annotations.TenantId")

# Regex to find: class XxxJpaEntity( ... ) {
# and replace with: class XxxJpaEntity( ... ) {\n    @TenantId @Column(name = "tenant_id") var tenantId: String? = null
def replacer(match):
    return match.group(0) + "\n    @TenantId @Column(name = \"tenant_id\") var tenantId: String? = null"

# We look for ") {" that comes after "JpaEntity("
# A simple way is to replace ") {" only for classes ending with JpaEntity.
# Let's find all occurrences of "class XxxJpaEntity" and the next ") {"
pattern = re.compile(r'(class\s+[A-Za-z0-9_]+JpaEntity\s*\([\s\S]*?\)\s*\{)')
content = pattern.sub(replacer, content)

with open(filepath, "w") as f:
    f.write(content)

print("Added tenantId inside class bodies")
