CREATE TABLE test_case_folders (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES test_case_folders(id) ON DELETE CASCADE
);

ALTER TABLE test_cases ADD COLUMN folder_id VARCHAR(36) REFERENCES test_case_folders(id) ON DELETE SET NULL;
