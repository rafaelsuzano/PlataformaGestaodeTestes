-- V26__api_testing_module.sql

-- 1. ApiCollections
CREATE TABLE IF NOT EXISTS api_collections (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    parent_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_api_coll_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_api_coll_parent FOREIGN KEY (parent_id) REFERENCES api_collections(id) ON DELETE CASCADE
);

-- 2. ApiEnvironments
CREATE TABLE IF NOT EXISTS api_environments (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_api_env_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 3. ApiVariables
CREATE TABLE IF NOT EXISTS api_variables (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    scope VARCHAR(50) NOT NULL, -- GLOBAL, ENVIRONMENT, COLLECTION
    scope_id VARCHAR(36),       -- ID depending on scope
    key_name VARCHAR(255) NOT NULL,
    value_data TEXT,
    is_secret BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Alter ApiTestRequests to support new features
-- The existing table is api_test_requests. We will alter it instead of dropping.
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS collection_id VARCHAR(36);
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(36);
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS body_type VARCHAR(50) DEFAULT 'JSON';
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS pre_request_script TEXT;
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS post_response_script TEXT;
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS auth_type VARCHAR(50) DEFAULT 'NO_AUTH';
ALTER TABLE api_test_requests ADD COLUMN IF NOT EXISTS auth_config TEXT;
ALTER TABLE api_test_requests ADD CONSTRAINT fk_api_req_collection FOREIGN KEY (collection_id) REFERENCES api_collections(id) ON DELETE SET NULL;

-- 5. ApiAssertions
CREATE TABLE IF NOT EXISTS api_assertions (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    request_id VARCHAR(36) NOT NULL,
    source VARCHAR(50) NOT NULL, -- STATUS_CODE, RESPONSE_TIME, HEADER, JSON_BODY
    property_path VARCHAR(255),  -- $.data.id
    operator VARCHAR(50) NOT NULL, -- EQUALS, EXISTS, CONTAINS, GT, LT
    expected_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_api_ass_request FOREIGN KEY (request_id) REFERENCES api_test_requests(id) ON DELETE CASCADE
);

-- 6. ApiExecutionResults
CREATE TABLE IF NOT EXISTS api_execution_results (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36) NOT NULL,
    execution_id VARCHAR(36) NOT NULL,
    request_id VARCHAR(36) NOT NULL,
    status_code INT,
    response_time_ms BIGINT,
    response_body TEXT,
    response_headers TEXT,
    assertions_result TEXT, -- JSON array of results
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_api_res_execution FOREIGN KEY (execution_id) REFERENCES api_test_executions(id) ON DELETE CASCADE,
    CONSTRAINT fk_api_res_request FOREIGN KEY (request_id) REFERENCES api_test_requests(id) ON DELETE CASCADE
);

-- Note: api_test_executions already exists, we might need to add fields
ALTER TABLE api_test_executions ADD COLUMN IF NOT EXISTS environment_id VARCHAR(36);
ALTER TABLE api_test_executions ADD COLUMN IF NOT EXISTS execution_type VARCHAR(50) DEFAULT 'SINGLE';
ALTER TABLE api_test_executions ADD COLUMN IF NOT EXISTS total_passed INT DEFAULT 0;
ALTER TABLE api_test_executions ADD COLUMN IF NOT EXISTS total_failed INT DEFAULT 0;
ALTER TABLE api_test_executions ADD CONSTRAINT fk_api_exec_env FOREIGN KEY (environment_id) REFERENCES api_environments(id) ON DELETE SET NULL;
