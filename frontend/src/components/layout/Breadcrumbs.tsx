import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Dashboard',
  'projetos': 'Projetos',
  'usuarios': 'Usuários',
  'requisitos': 'Requisitos',
  'casos-teste': 'Casos de Teste',
  'planos-teste': 'Planos de Teste',
  'historico-execucoes': 'Histórico',
  'logs': 'Logs',
  'ambientes': 'Ambientes',
  'sprints': 'Sprints',
  'integracoes': 'Integrações',
  'api-tester': 'API Tester',
  'central-api': 'Central API',
  'execucao': 'Execução',
  'defeitos': 'Defeitos',
  'admin': 'Administração',
  'funcionalidades': 'Funcionalidades',
  'features': 'Features',
  'cenarios': 'Cenários',
  'evidencias': 'Evidências',
  'automacao-cypress': 'Cypress',
  'automacao-playwright': 'Playwright',
  'automacao-selenium': 'Selenium',
  'pipelines': 'Pipelines',
  'cobertura': 'Cobertura',
  'relatorios': 'Relatórios',
  'metricas': 'Métricas',
  'times': 'Times',
  'perfis': 'Perfis',
  'permissoes': 'Permissões',
  'banco-de-dados': 'Banco de Dados',
  'backup': 'Backup',
  'api-keys': 'API Keys',
  'tokens': 'Tokens',
  'auditoria': 'Auditoria',
  'notificacoes': 'Notificações',
  'licenciamento': 'Licenciamento',
  'faturamento': 'Faturamento'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center text-sm text-slate-400 mb-6 font-medium">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
        <Home size={14} />
        <span>Início</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = routeNames[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={14} className="mx-2 text-slate-600" />
            {isLast ? (
              <span className="text-slate-200">{name}</span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
