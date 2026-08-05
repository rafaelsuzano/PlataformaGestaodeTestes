import os
import re

directory = "backend/src/main/resources/db/migration"

for filename in sorted(os.listdir(directory)):
    if filename.endswith(".sql"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r") as f:
            content = f.read()
            # Basic replacements
            content = content.replace("DATETIME", "TIMESTAMP")
            content = content.replace("AUTOINCREMENT", "SERIAL")
            # SQLite uses INTEGER PRIMARY KEY AUTOINCREMENT. Postgres uses SERIAL PRIMARY KEY.
            # So `INTEGER PRIMARY KEY SERIAL` is invalid. We need to replace `INTEGER PRIMARY KEY AUTOINCREMENT` with `SERIAL PRIMARY KEY`.
            content = content.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
            
            with open(filepath, "w") as f2:
                f2.write(content)
        print(f"Processed {filename}")
