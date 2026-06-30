
CREATE TABLE projects (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    status TEXT NOT NULL,
    manager_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
