import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Server, Database, Save, 
  Key, Webhook, Activity, Bell, CreditCard, Box, Settings2
} from 'lucide-react';

const settingsCategories = [
  {
    title: 'Organização',
    items: [
      { id: 'modulos', name: 'Módulos e Categorias', icon: <Settings2 className="text-indigo-400" size={24} />, path: '/configuracoes/modulos-categorias', desc: 'Estrutura do sistema' },
      { id: 'times', name: 'Times', icon: <Users className="text-indigo-400" size={24} />, path: '/times', desc: 'Estrutura organizacional' },
    ]
  },
  {
    title: 'Usuários e Segurança',
    items: [
      { id: 'usuarios', name: 'Usuários', icon: <Users className="text-emerald-400" size={24} />, path: '/usuarios', desc: 'Membros da plataforma' },
      { id: 'perfis', name: 'Perfis', icon: <Shield className="text-rose-400" size={24} />, path: '/perfis', desc: 'Cargos e responsabilidades' },
      { id: 'permissoes', name: 'Permissões', icon: <Shield className="text-orange-400" size={24} />, path: '/permissoes', desc: 'Controle de acesso granular' },
    ]
  },
  {
    title: 'Infraestrutura',
    items: [
      { id: 'ambientes', name: 'Ambientes', icon: <Server className="text-cyan-400" size={24} />, path: '/ambientes', desc: 'Dev, Staging, Prod' },
      { id: 'banco', name: 'Banco de Dados', icon: <Database className="text-sky-400" size={24} />, path: '/banco-de-dados', desc: 'Conexões e schemas' },
      { id: 'backup', name: 'Backup', icon: <Save className="text-amber-400" size={24} />, path: '/backup', desc: 'Rotinas de segurança' },
    ]
  },
  {
    title: 'Integrações',
    items: [
      { id: 'api', name: 'API Keys', icon: <Key className="text-yellow-400" size={24} />, path: '/api-keys', desc: 'Chaves de acesso externas' },
      { id: 'tokens', name: 'Tokens', icon: <Box className="text-lime-400" size={24} />, path: '/tokens', desc: 'Tokens pessoais' },
      { id: 'webhook', name: 'Webhooks', icon: <Webhook className="text-pink-400" size={24} />, path: '/integracoes', desc: 'Eventos em tempo real' },
    ]
  },
  {
    title: 'Plataforma',
    items: [
      { id: 'auditoria', name: 'Auditoria', icon: <Activity className="text-teal-400" size={24} />, path: '/auditoria', desc: 'Logs de sistema e segurança' },
      { id: 'notificacoes', name: 'Notificações', icon: <Bell className="text-red-400" size={24} />, path: '/notificacoes', desc: 'Regras de disparo' },
      { id: 'faturamento', name: 'Faturamento', icon: <CreditCard className="text-green-400" size={24} />, path: '/faturamento', desc: 'Plano e cobranças' },
    ]
  }
];

export function SettingsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Configurações da Plataforma</h1>
        <p className="text-slate-400 mt-1">Gerencie todos os aspectos do seu ambiente corporativo.</p>
      </div>

      <div className="space-y-10">
        {settingsCategories.map((category) => (
          <div key={category.title}>
            <h2 className="text-sm font-semibold tracking-wider text-primary uppercase mb-4">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="bg-card border border-slate-800 rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-800/50 hover:border-slate-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 group-hover:bg-slate-800 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
