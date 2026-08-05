import os
import re

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/shared/infrastructure/jpa/JpaEntities.kt"

with open(filepath, "r") as f:
    content = f.read()

# Add import if missing
if "import org.hibernate.annotations.TenantId" not in content:
    content = content.replace("import jakarta.persistence.Id", "import jakarta.persistence.Id\nimport org.hibernate.annotations.TenantId")

# Find all @Entity classes and add tenantId
# class XJpaEntity(
#     @Id var id: String,
#     ...
# )
def replacer(match):
    # match.group(0) is something like "class ProjectJpaEntity(\n    @Id var id: String,"
    return match.group(0) + "\n    @TenantId @Column(name = \"tenant_id\") var tenantId: String? = null,"

content = re.sub(r"(class\s+[A-Za-z0-9_]+JpaEntity\s*\(\n\s*@Id\s+var\s+[A-Za-z0-9_]+\s*:\s*String,)", replacer, content)

with open(filepath, "w") as f:
    f.write(content)

print("Added tenantId to all JPA entities")
