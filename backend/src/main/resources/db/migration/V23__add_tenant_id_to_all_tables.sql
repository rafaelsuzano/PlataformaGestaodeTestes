-- V23: Adicionar isolamento Multi-Tenant em todas as tabelas
-- Define um valor default temporário para suportar o schema existente sem quebrar os NOT NULL constraints.

ALTER TABLE api_test_executions ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE api_test_plans ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE api_test_requests ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE automated_test_results ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE automated_test_runs ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE categories ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE defects ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE environments ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE execution_history ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE features ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE integrations ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE modules ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE projects ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE requirements ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE sprints ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE system_logs ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_case_folders ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_cases ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_execution_steps ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_executions ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_plans ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE test_steps ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE user_projects ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';
ALTER TABLE users ADD COLUMN tenant_id VARCHAR(36) NOT NULL DEFAULT 'default-tenant';

-- Criar indices para performance, já que toda query irá filtrar por tenant_id
CREATE INDEX idx_api_test_executions_tenant ON api_test_executions(tenant_id);
CREATE INDEX idx_api_test_plans_tenant ON api_test_plans(tenant_id);
CREATE INDEX idx_api_test_requests_tenant ON api_test_requests(tenant_id);
CREATE INDEX idx_automated_test_results_tenant ON automated_test_results(tenant_id);
CREATE INDEX idx_automated_test_runs_tenant ON automated_test_runs(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_defects_tenant ON defects(tenant_id);
CREATE INDEX idx_environments_tenant ON environments(tenant_id);
CREATE INDEX idx_execution_history_tenant ON execution_history(tenant_id);
CREATE INDEX idx_features_tenant ON features(tenant_id);
CREATE INDEX idx_integrations_tenant ON integrations(tenant_id);
CREATE INDEX idx_modules_tenant ON modules(tenant_id);
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_requirements_tenant ON requirements(tenant_id);
CREATE INDEX idx_sprints_tenant ON sprints(tenant_id);
CREATE INDEX idx_system_logs_tenant ON system_logs(tenant_id);
CREATE INDEX idx_test_case_folders_tenant ON test_case_folders(tenant_id);
CREATE INDEX idx_test_cases_tenant ON test_cases(tenant_id);
CREATE INDEX idx_test_execution_steps_tenant ON test_execution_steps(tenant_id);
CREATE INDEX idx_test_executions_tenant ON test_executions(tenant_id);
CREATE INDEX idx_test_plans_tenant ON test_plans(tenant_id);
CREATE INDEX idx_test_steps_tenant ON test_steps(tenant_id);
CREATE INDEX idx_user_projects_tenant ON user_projects(tenant_id);
CREATE INDEX idx_users_tenant ON users(tenant_id);
