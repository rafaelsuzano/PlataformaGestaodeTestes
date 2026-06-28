CREATE TABLE test_executions (
    id TEXT PRIMARY KEY,
    test_case_id TEXT NOT NULL,
    tester_id TEXT,
    environment TEXT,
    status TEXT NOT NULL, /* PENDING, IN_PROGRESS, PASSED, FAILED, BLOCKED */
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
);

CREATE TABLE test_execution_steps (
    id TEXT PRIMARY KEY,
    test_execution_id TEXT NOT NULL,
    test_step_id TEXT,
    step_number INTEGER NOT NULL,
    action TEXT NOT NULL,
    expected_result TEXT NOT NULL,
    actual_result TEXT,
    status TEXT, /* PASSED, FAILED, BLOCKED */
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_execution_id) REFERENCES test_executions(id),
    FOREIGN KEY (test_step_id) REFERENCES test_steps(id)
);

CREATE TABLE defects (
    id TEXT PRIMARY KEY,
    test_execution_id TEXT,
    test_case_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL, /* LOW, MEDIUM, HIGH, CRITICAL */
    status TEXT NOT NULL, /* OPEN, IN_PROGRESS, RESOLVED, CLOSED */
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_execution_id) REFERENCES test_executions(id),
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
);
