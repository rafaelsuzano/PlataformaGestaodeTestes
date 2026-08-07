import os
import glob

service_files = glob.glob("backend/src/main/kotlin/br/com/suzanoit/qa/modules/**/application/*.kt", recursive=True)

for file in service_files:
    content = open(file).read()
    
    # Check if the service uses any repository
    if "Repository" in content:
        # We need to make sure we import shared.domain
        if "import br.com.suzanoit.qa.modules.shared.domain" not in content:
            content = content.replace("package ", "package ")
            parts = content.split("\n", 1)
            content = parts[0] + "\nimport br.com.suzanoit.qa.modules.shared.domain.*\n" + parts[1]
    
    open(file, 'w').write(content)

