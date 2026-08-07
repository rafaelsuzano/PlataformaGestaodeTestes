-- V25__add_performance_indexes.sql

-- Índices para melhorar a performance das queries mais utilizadas na plataforma.

-- Projetos
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);

-- Execuções de Teste
CREATE INDEX IF NOT EXISTS idx_test_executions_project_id ON test_executions(project_id);
CREATE INDEX IF NOT EXISTS idx_test_executions_tenant_id ON test_executions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_test_executions_status ON test_executions(status);

-- Casos de Teste
CREATE INDEX IF NOT EXISTS idx_test_cases_project_id ON test_cases(project_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_folder_id ON test_cases(folder_id);

-- Histórico de Execuções
CREATE INDEX IF NOT EXISTS idx_execution_history_test_execution_id ON execution_history(test_execution_id);
