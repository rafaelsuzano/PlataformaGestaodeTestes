import os
import re
from pathlib import Path

ROOT = Path("backend/src/main/kotlin/br/com/suzanoit/qa/modules")

# Maps short class name -> correct package
class_packages = {}

# Step 1: Scan all files to find where every class/interface is defined
for kt_file in ROOT.rglob("*.kt"):
    content = kt_file.read_text()
    
    # Extract package
    pkg_match = re.search(r"^package\s+([\w\.]+)", content, re.MULTILINE)
    if not pkg_match:
        continue
    pkg = pkg_match.group(1)
    
    # Find all classes/interfaces/data classes
    # regex matches: class X, interface Y, data class Z
    for match in re.finditer(r"(?:class|interface|object)\s+([A-Za-z0-9_]+)", content):
        cls_name = match.group(1)
        class_packages[cls_name] = pkg

# Helper to add an import if it's missing and the class is used
def ensure_imports(content, file_pkg):
    # Find all words that look like CamelCase class names in the content
    words = set(re.findall(r"\b[A-Z][a-zA-Z0-9_]+\b", content))
    
    new_imports = set()
    for w in words:
        if w in class_packages:
            target_pkg = class_packages[w]
            # Don't import from same package
            if target_pkg != file_pkg:
                new_imports.add(f"import {target_pkg}.{w}")
                
    # Insert new imports after the package declaration
    lines = content.splitlines()
    out_lines = []
    imports_added = False
    
    for line in lines:
        out_lines.append(line)
        if line.startswith("package ") and not imports_added:
            out_lines.append("")
            for imp in sorted(new_imports):
                if imp not in content:
                    out_lines.append(imp)
            imports_added = True
            
    return "\n".join(out_lines)

# Step 2: Fix inline fully-qualified old paths and add missing imports
for kt_file in ROOT.rglob("*.kt"):
    content = kt_file.read_text()
    
    pkg_match = re.search(r"^package\s+([\w\.]+)", content, re.MULTILINE)
    file_pkg = pkg_match.group(1) if pkg_match else ""
    
    # Fix old inline fully qualified names
    content = content.replace("br.com.suzanoit.qa.core.domain.", "br.com.suzanoit.qa.modules.shared.domain.")
    content = content.replace("br.com.suzanoit.qa.infrastructure.persistence.jpa.", "br.com.suzanoit.qa.modules.shared.infrastructure.jpa.")
    content = content.replace("br.com.suzanoit.qa.infrastructure.persistence.", "br.com.suzanoit.qa.modules.shared.infrastructure.")
    
    # Some domain things might be broken, let's ensure imports
    content = ensure_imports(content, file_pkg)
    
    # Some common spring / java missing imports that might have been lost
    # (Though we didn't remove standard imports, only custom ones, but just in case)
    
    kt_file.write_text(content)

print("Fixed imports and inline fully qualified names.")
