import os
import glob

files = glob.glob("backend/src/main/kotlin/br/com/suzanoit/qa/modules/**/presentation/dto/*.kt", recursive=True)

for file in files:
    content = open(file).read()
    content = content.replace("import br.com.suzanoit.qa.modules.shared.domain.Project", "import br.com.suzanoit.qa.modules.projects.domain.Project")
    content = content.replace("import br.com.suzanoit.qa.modules.shared.domain.Feature", "import br.com.suzanoit.qa.modules.projects.domain.Feature")
    content = content.replace("import br.com.suzanoit.qa.modules.shared.domain.", "import br.com.suzanoit.qa.modules.core.domain.") # For others like Category, Module, TestCase
    open(file, 'w').write(content)

