
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardList, 
  Puzzle, 
  CheckSquare, 
  CalendarCheck, 
  PlaySquare, 
  History, 
  FolderArchive,
  Terminal,
  Wand2,
  Activity,
  Bug,
  PieChart,
  BarChart4,
  Settings2,
  Timer
} from 'lucide-react';

const qaMenu = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { type: 'subheader', text: 'Gestão' },
  { text: 'Projetos', icon: <FolderOpen size={20} />, path: '/projetos' },
  { text: 'Requisitos', icon: <ClipboardList size={20} />, path: '/requisitos' },
  { text: 'Funcionalidades', icon: <Puzzle size={20} />, path: '/funcionalidades' },
  { text: 'Casos de Teste', icon: <CheckSquare size={20} />, path: '/casos-teste' },
  { type: 'subheader', text: 'Planejamento' },
  { text: 'Planos de Teste', icon: <CalendarCheck size={20} />, path: '/planos-teste' },
  { text: 'Sprints (Ciclos)', icon: <Timer size={20} />, path: '/sprints' },
  { type: 'subheader', text: 'Execução' },
  { text: 'Central de Execução', icon: <PlaySquare size={20} />, path: '/execucao' },
  { text: 'Histórico', icon: <History size={20} />, path: '/historico-execucoes' },
  { text: 'Evidências', icon: <FolderArchive size={20} />, path: '/evidencias' },
  { type: 'subheader', text: 'Automação' },
  { text: 'Automação Playwright', icon: <Terminal size={20} />, path: '/automacao' },
  { text: 'Gerador Playwright (IA)', icon: <Wand2 size={20} />, path: '/automacao/gherkin-playwright' },
  { text: 'Pipelines', icon: <Activity size={20} />, path: '/pipelines' },
  { type: 'subheader', text: 'Qualidade' },
  { text: 'Defeitos / Bugs', icon: <Bug size={20} />, path: '/defeitos' },
  { text: 'Cobertura', icon: <PieChart size={20} />, path: '/cobertura' },
  { text: 'Relatórios', icon: <BarChart4 size={20} />, path: '/relatorios' },
  { text: 'Métricas', icon: <Settings2 size={20} />, path: '/metricas' },
  { type: 'subheader', text: 'Configurações da Plataforma' },
  { text: 'Painel de Configurações', icon: <Settings2 size={20} />, path: '/admin' },
  { text: 'Módulos e Categorias', icon: <Puzzle size={20} />, path: '/configuracoes/modulos-categorias' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-slate-800/50 flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">SuzanoIT QA</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-1">
          {qaMenu.map((item, index) => {
            if (item.type === 'subheader') {
              return (
                <div key={`sub-${index}`} className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.text}
                </div>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => navigate(item.path as string)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.text}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-slate-800/30 rounded-lg p-3 text-xs text-slate-400">
          <div className="font-semibold text-slate-300 mb-1">Suzano IT</div>
          <div>Plataforma de Qualidade</div>
          <div className="mt-2 text-[10px] text-slate-500">v2.0.0-enterprise</div>
        </div>
      </div>
    </aside>
  );
}
