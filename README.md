# Plataforma de Gestão de Testes - SuzanoIT

## Descrição
A **Plataforma de Gestão de Testes** é uma solução completa para gerenciamento do ciclo de vida de testes de software, abrangendo desde a concepção de requisitos até a execução de testes automatizados e gestão de defeitos. A aplicação possui uma arquitetura moderna dividida em backend e frontend, sendo projetada para fornecer uma experiência centralizada para o time de Qualidade (QA).

## Arquitetura e Tecnologias
- **Frontend**: Aplicação React com TypeScript, construída utilizando Vite. Utiliza Tailwind CSS para estilização, Shadcn UI para componentes de interface, Chart.js/Recharts para gráficos e React Router para navegação.
- **Backend**: API construída em Kotlin utilizando Spring Boot, com suporte a Spring Data JPA e Flyway para versionamento do banco de dados.
- **Banco de Dados**: Configurado com SQLite (armazenado na pasta `/data`), permitindo uma execução leve e sem dependências externas complexas.
- **Infraestrutura**: Suporte completo a containers via Docker, com orquestração simplificada através do `docker-compose.yml`.

## Principais Funcionalidades

### 1. Gestão Ágil e Planejamento
- **Dashboard Executivo**: Visão geral com indicadores, métricas e gráficos consolidados.
- **Gestão de Projetos e Sprints**: Cadastro e acompanhamento de projetos de teste. A organização das entregas é feita por **sprints (ciclos)**, nas quais é possível **vincular repositórios (GitHub e GitLab)** e **selecionar a branch específica** para a execução dos testes.
- **Requisitos e Funcionalidades**: Rastreamento de requisitos e cadastro de funcionalidades do sistema para garantir a cobertura.

### 2. Design e Planejamento de Testes
- **Casos de Teste**: Criação, edição e detalhamento de casos de teste, incluindo passos e resultados esperados.
- **Planos de Teste**: Agrupamento lógico de casos de teste em planos de execução.

### 3. Execução e Automação
- **Execução Manual**: Interface para registro de execuções de testes (Pass/Fail) e geração de evidências.
- **Histórico de Execuções**: Acompanhamento e auditoria de todas as execuções realizadas ao longo do tempo.
- **Testes de API**: Interface dedicada para realização de requisições de API (ApiTester) e uma Central de Execução de APIs.
- **Automação Web e BDD**: 
  - Gestão de automação de interface utilizando Playwright.
  - Suporte à escrita e execução de testes baseados em comportamento (BDD) utilizando sintaxe Gherkin.

### 4. Acompanhamento, Métricas e Qualidade
- **Gestão de Defeitos**: Abertura, classificação e acompanhamento do ciclo de vida de bugs encontrados.
- **Matriz de Cobertura**: Visualização da cobertura de testes sobre os requisitos e funcionalidades mapeados.
- **Métricas e Relatórios**: Geração e exportação de relatórios gerenciais e métricas de qualidade consolidadas.
- **Central de Logs**: Visualização, busca e auditoria de logs gerados pelas execuções automáticas e pelo sistema.

### 5. Configurações e Administração
- **Gestão de Ambientes**: Controle e cadastro de diferentes ambientes de teste (DEV, QA, UAT, PRD).
- **Gestão de Usuários**: Controle de acessos, permissões e cadastro de membros da equipe.
- **Integrações**: Configuração de integrações com ferramentas de terceiros (Jira, Slack, ferramentas de CI/CD, etc.).
- **Customização (White-Label)**: Configuração visual da plataforma, habilitando customização de cores, logos e categorização de módulos conforme a necessidade da empresa.

## Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados (para execução via container)
- Node.js (v18+) e Java 21 (caso queira executar manualmente)

### Via Docker (Recomendado)
A maneira mais fácil de iniciar a aplicação é utilizando o Docker Compose na raiz do projeto:

```bash
# Constrói as imagens e inicia os containers
docker-compose up --build
```
A aplicação estará disponível nos seguintes endereços:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

### Execução Manual (Modo Desenvolvimento)

**1. Iniciando o Backend**
```bash
cd backend
./gradlew bootRun
```
*O banco de dados SQLite será criado automaticamente na pasta `data`.*

**2. Iniciando o Frontend**
```bash
cd frontend
npm install
npm run dev
```
