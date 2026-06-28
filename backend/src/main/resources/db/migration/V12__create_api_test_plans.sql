CREATE TABLE api_test_plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE api_test_requests (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) NOT NULL REFERENCES api_test_plans(id),
    name VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    url VARCHAR(2000) NOT NULL,
    headers TEXT,
    body TEXT,
    expected_status INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE api_test_executions (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) NOT NULL REFERENCES api_test_plans(id),
    status VARCHAR(50) NOT NULL, -- PASSED, FAILED
    execution_time_ms INTEGER NOT NULL,
    success_rate DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL
);
