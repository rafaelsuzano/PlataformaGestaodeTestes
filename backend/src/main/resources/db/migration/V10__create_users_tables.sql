CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE user_projects (
    user_id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Inserir um usuário admin padrão
INSERT INTO users (id, name, email, password, profile, created_at, updated_at)
VALUES ('admin-id', 'Administrador', 'admin@suzano.com.br', 'admin', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
