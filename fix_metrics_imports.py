import os

filepath = "backend/src/main/kotlin/br/com/suzanoit/qa/modules/analytics/application/MetricsService.kt"
if os.path.exists(filepath):
    lines = open(filepath).readlines()
    seen_imports = set()
    new_lines = []
    for line in lines:
        if line.startswith("import "):
            if line in seen_imports:
                continue
            seen_imports.add(line)
        new_lines.append(line)
    open(filepath, "w").writelines(new_lines)
    print("Deduplicated imports in MetricsService.kt")

