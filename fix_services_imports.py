import os
import glob

service_files = glob.glob("backend/src/main/kotlin/br/com/suzanoit/qa/modules/**/application/*.kt", recursive=True)

for file in service_files:
    content = open(file).read()
    
    new_lines = []
    for line in content.split("\n"):
        if "Repository" in line and "import br.com.suzanoit.qa.modules." in line and not "shared.domain" in line and not "jpa" in line and not "api_testing" in line:
            class_name = line.strip().split(".")[-1]
            if class_name.endswith("Repository"):
                continue # Skip this import, it's incorrect and we already have shared.domain.*
        new_lines.append(line)
        
    open(file, 'w').write("\n".join(new_lines))

