CREATE TABLE test_plans (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    sprint_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    environment VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL
);

ALTER TABLE test_executions ADD COLUMN test_plan_id VARCHAR(36) REFERENCES test_plans(id) ON DELETE CASCADE;
