
CREATE TABLE test_cases_new (
    id TEXT PRIMARY KEY,
    feature_id TEXT,
    folder_id VARCHAR(36) REFERENCES test_case_folders(id) ON DELETE SET NULL,
    requirement_id TEXT REFERENCES requirements(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    gherkin_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feature_id) REFERENCES features(id)
);

INSERT INTO test_cases_new (id, feature_id, folder_id, requirement_id, title, description, type, status, gherkin_content, created_at, updated_at)
SELECT id, feature_id, folder_id, requirement_id, title, description, type, status, gherkin_content, created_at, updated_at FROM test_cases;

DROP TABLE test_cases;

ALTER TABLE test_cases_new RENAME TO test_cases;

