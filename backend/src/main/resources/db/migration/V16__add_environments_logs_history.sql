CREATE TABLE environments (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_url VARCHAR(255),
    type VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    color VARCHAR(50),
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE execution_history (
    id VARCHAR(36) PRIMARY KEY,
    test_execution_id VARCHAR(36) REFERENCES test_executions(id) ON DELETE CASCADE,
    test_case_id VARCHAR(36) NOT NULL,
    environment_id VARCHAR(36) REFERENCES environments(id) ON DELETE SET NULL,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_ms BIGINT,
    total_steps INT DEFAULT 0,
    passed_steps INT DEFAULT 0,
    failed_steps INT DEFAULT 0,
    blocked_steps INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    observations TEXT
);

CREATE TABLE system_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(50),
    browser VARCHAR(255),
    result VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
