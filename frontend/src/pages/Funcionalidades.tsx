import React, { useState, useMemo } from 'react';
import { 
  Card, CardContent, Typography, Button, TextField, MenuItem, 
  RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, 
  Switch, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Chip, Box, Tooltip
} from '@mui/material';
import { 
  Plus, Save, X, Search, Edit2, Copy, Trash2, 
  Code, Database, Globe, LayoutDashboard, Users, Activity, PlaySquare, Settings, CheckCircle2, AlertCircle, StopCircle, Archive
} from 'lucide-react';

// Interfaces
interface Feature {
  id: string;
  code: string;
  name: string;
  module: string;
  category: string;
  description: string;
  objective: string;
  status: 'Ativa' | 'Em Desenvolvimento' | 'Inativa' | 'Descontinuada';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  version: string;
  permissions: string[];
  dependencies: string;
  tags: string;
  iconName: string;
  color: string;
  menuOrder: number;
  url: string;
  visibleInMenu: boolean;
  showInDashboard: boolean;
  createdAt: string;
  updatedAt: string;
}

// Constantes
const MODULES = ['Administração', 'Gestão de Testes', 'BDD', 'Automação', 'Execuções', 'Relatórios', 'Dashboard', 'Usuários', 'Integrações', 'Configurações'];
const CATEGORIES = ['Cadastro', 'Consulta', 'Relatório', 'Configuração', 'Integração', 'Automação', 'Dashboard'];
const PERMISSIONS = ['Administrador', 'QA', 'Desenvolvedor', 'Tech Lead', 'Gestor', 'Cliente'];
const ICONS = [
  { name: 'Código', icon: <Code size={24} /> },
  { name: 'Banco de Dados', icon: <Database size={24} /> },
  { name: 'API', icon: <Globe size={24} /> },
  { name: 'Dashboard', icon: <LayoutDashboard size={24} /> },
  { name: 'Usuários', icon: <Users size={24} /> },
  { name: 'Automação', icon: <Activity size={24} /> },
  { name: 'Testes', icon: <PlaySquare size={24} /> },
  { name: 'Configuração', icon: <Settings size={24} /> },
];

const INITIAL_FEATURE: Feature = {
  id: '',
  code: 'FUNC-001',
  name: '',
  module: 'Gestão de Testes',
  category: 'Cadastro',
  description: '',
  objective: '',
  status: 'Em Desenvolvimento',
  priority: 'Média',
  version: '1.0.0',
  permissions: ['QA', 'Administrador'],
  dependencies: '',
  tags: '',
  iconName: 'Código',
  color: '#6366f1', // Indigo
  menuOrder: 1,
  url: '/',
  visibleInMenu: true,
  showInDashboard: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Dados Mockados para a Tabela
const MOCK_FEATURES: Feature[] = [
  {
    ...INITIAL_FEATURE,
    id: '1',
    code: 'FUNC-001',
    name: 'Gestão de Casos de Teste',
    status: 'Ativa',
    priority: 'Alta',
  },
  {
    ...INITIAL_FEATURE,
    id: '2',
    code: 'FUNC-002',
    name: 'Execução de Cenários BDD',
    module: 'BDD',
    category: 'Automação',
    status: 'Em Desenvolvimento',
    priority: 'Crítica',
    iconName: 'Testes',
    color: '#ec4899', // Pink
  }
];

export const Funcionalidades: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(MOCK_FEATURES);
  const [formData, setFormData] = useState<Feature>(INITIAL_FEATURE);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleChange = (field: keyof Feature, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (perm: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: perms };
    });
  };

  const handleSave = () => {
    if (!formData.name) {
      alert("O Nome da Funcionalidade é obrigatório!");
      return;
    }
    if (isEditing) {
      setFeatures(features.map(f => f.id === formData.id ? { ...formData, updatedAt: new Date().toISOString() } : f));
    } else {
      const newFeature = { 
        ...formData, 
        id: Math.random().toString(), 
        code: `FUNC-00${features.length + 1}` 
      };
      setFeatures([newFeature, ...features]);
    }
    resetForm();
  };

  const handleEdit = (feature: Feature) => {
    setFormData(feature);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicate = (feature: Feature) => {
    setFormData({ 
      ...feature, 
      id: '', 
      code: `FUNC-00${features.length + 1}`, 
      name: `${feature.name} (Cópia)` 
    });
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setFeatures(features.filter(f => f.id !== deleteId));
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FEATURE, code: `FUNC-00${features.length + 1}` });
    setIsEditing(false);
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: features.length,
      ativas: features.filter(f => f.status === 'Ativa').length,
      emDev: features.filter(f => f.status === 'Em Desenvolvimento').length,
      inativas: features.filter(f => f.status === 'Inativa').length,
      descontinuadas: features.filter(f => f.status === 'Descontinuada').length,
    };
  }, [features]);

  // Helpers UI
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Ativa': return '#10b981'; // Emerald
      case 'Em Desenvolvimento': return '#3b82f6'; // Blue
      case 'Inativa': return '#f59e0b'; // Amber
      case 'Descontinuada': return '#ef4444'; // Red
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Ativa': return <CheckCircle2 size={16} />;
      case 'Em Desenvolvimento': return <Activity size={16} />;
      case 'Inativa': return <StopCircle size={16} />;
      case 'Descontinuada': return <Archive size={16} />;
      default: return undefined;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Baixa': return 'rgba(59, 130, 246, 0.2)'; // Blue
      case 'Média': return 'rgba(245, 158, 11, 0.2)'; // Amber
      case 'Alta': return 'rgba(249, 115, 22, 0.2)'; // Orange
      case 'Crítica': return 'rgba(239, 68, 68, 0.2)'; // Red
      default: return 'transparent';
    }
  };
  
  const getPriorityTextColor = (priority: string) => {
    switch(priority) {
      case 'Baixa': return '#60a5fa'; 
      case 'Média': return '#fbbf24'; 
      case 'Alta': return '#fb923c'; 
      case 'Crítica': return '#f87171'; 
      default: return '#cbd5e1';
    }
  };

  const SelectedIcon = ICONS.find(i => i.name === formData.iconName)?.icon || <Code size={24} />;

  // Filtro
  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 text-slate-200">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <LayoutDashboard className="text-indigo-400" />
            Cadastro de Funcionalidades
          </h1>
          <p className="text-slate-400 mt-2">
            Gerencie todas as funcionalidades disponíveis na Plataforma SuzanoIT QA.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={resetForm}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#cbd5e1' }}
          >
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, color: 'white' }}
          >
            <Save className="mr-2 h-4 w-4" /> Salvar Funcionalidade
          </Button>
          <Button 
            variant="contained" 
            onClick={resetForm}
            sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, color: 'white' }}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova
          </Button>
        </div>
      </div>

      {/* KPI BAR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-slate-800/50' },
          { label: 'Ativas', value: stats.ativas, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
          { label: 'Em Dev', value: stats.emDev, color: 'text-blue-400', bg: 'bg-blue-900/20' },
          { label: 'Inativas', value: stats.inativas, color: 'text-amber-400', bg: 'bg-amber-900/20' },
          { label: 'Descontinuadas', value: stats.descontinuadas, color: 'text-red-400', bg: 'bg-red-900/20' }
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center backdrop-blur-md transition-all hover:scale-105`}>
            <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
            <span className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: FORMULARIO */}
        <div className="lg:col-span-2 space-y-6">
          <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-700/50">
                <Settings className="text-indigo-400" />
                <Typography variant="h6" className="text-white font-semibold">Informações Gerais</Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextField 
                  label="Nome da Funcionalidade *" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  fullWidth 
                  className="md:col-span-2"
                  variant="outlined"
                  size="small"
                  sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField 
                  label="Código *" 
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  fullWidth 
                  variant="outlined"
                  size="small"
                  sx={{ input: { color: 'white', fontWeight: 'bold' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField 
                  select
                  label="Módulo" 
                  value={formData.module}
                  onChange={(e) => handleChange('module', e.target.value)}
                  fullWidth 
                  variant="outlined"
                  size="small"
                  slotProps={{ select: { style: { color: 'white' } } }}
                  sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                >
                  {MODULES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField 
                  select
                  label="Categoria" 
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  fullWidth 
                  variant="outlined"
                  size="small"
                  slotProps={{ select: { style: { color: 'white' } } }}
                  sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                >
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <TextField 
                  label="Descrição Completa" 
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  fullWidth 
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{ textarea: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField 
                  label="Objetivo (Finalidade)" 
                  value={formData.objective}
                  onChange={(e) => handleChange('objective', e.target.value)}
                  fullWidth 
                  multiline
                  rows={2}
                  variant="outlined"
                  sx={{ textarea: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
              </div>

              {/* Status e Prioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-700/50">
                <div>
                  <Typography variant="subtitle2" className="text-slate-400 mb-2">Status da Funcionalidade</Typography>
                  <RadioGroup 
                    value={formData.status} 
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {['Ativa', 'Em Desenvolvimento', 'Inativa', 'Descontinuada'].map(status => (
                      <FormControlLabel 
                        key={status} 
                        value={status} 
                        control={<Radio sx={{ color: getStatusColor(status), '&.Mui-checked': { color: getStatusColor(status) } }} />} 
                        label={<span className="text-slate-300 flex items-center gap-2">{getStatusIcon(status)} {status}</span>} 
                      />
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Typography variant="subtitle2" className="text-slate-400 mb-2">Prioridade</Typography>
                    <div className="flex gap-2 flex-wrap">
                      {['Baixa', 'Média', 'Alta', 'Crítica'].map(p => (
                        <Chip 
                          key={p} 
                          label={p} 
                          clickable
                          onClick={() => handleChange('priority', p)}
                          sx={{ 
                            bgcolor: formData.priority === p ? getPriorityColor(p) : 'transparent',
                            color: formData.priority === p ? getPriorityTextColor(p) : '#94a3b8',
                            border: `1px solid ${formData.priority === p ? getPriorityTextColor(p) : '#475569'}`,
                            fontWeight: formData.priority === p ? 'bold' : 'normal'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                  <TextField 
                    label="Versão" 
                    value={formData.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                </div>
              </div>

              {/* Permissões e Dependências */}
              <div className="pt-4 border-t border-slate-700/50">
                <Typography variant="subtitle2" className="text-slate-400 mb-3">Permissões de Acesso</Typography>
                <FormGroup className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PERMISSIONS.map(perm => (
                    <FormControlLabel 
                      key={perm}
                      control={
                        <Checkbox 
                          checked={formData.permissions.includes(perm)}
                          onChange={() => handlePermissionToggle(perm)}
                          sx={{ color: '#64748b', '&.Mui-checked': { color: '#6366f1' } }}
                        />
                      }
                      label={<span className="text-slate-300 text-sm">{perm}</span>}
                    />
                  ))}
                </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
                <TextField 
                  label="Dependências" 
                  value={formData.dependencies}
                  onChange={(e) => handleChange('dependencies', e.target.value)}
                  placeholder="Ex: Gestão de Projetos, Automação"
                  fullWidth 
                  variant="outlined"
                  size="small"
                  sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField 
                  label="Tags (separadas por vírgula)" 
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="Ex: BDD, API, Frontend"
                  fullWidth 
                  variant="outlined"
                  size="small"
                  sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
              </div>

              {/* UI & Navegação */}
              <div className="pt-4 border-t border-slate-700/50 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField 
                    select
                    label="Ícone Representativo" 
                    value={formData.iconName}
                    onChange={(e) => handleChange('iconName', e.target.value)}
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    slotProps={{ select: { style: { color: 'white' }, renderValue: (val: any) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {ICONS.find(i => i.name === val)?.icon} <span>{val as string}</span>
                      </Box>
                    ) } }}
                  >
                    {ICONS.map(i => (
                      <MenuItem key={i.name} value={i.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {i.icon} {i.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField 
                    label="Cor Tema (HEX)" 
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { height: '24px', cursor: 'pointer' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />

                  <TextField 
                    label="Ordem no Menu" 
                    type="number"
                    value={formData.menuOrder}
                    onChange={(e) => handleChange('menuOrder', parseInt(e.target.value))}
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField 
                    label="URL da Rota" 
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder="/minha-funcionalidade"
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { color: 'white', fontFamily: 'monospace' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                  <div className="flex gap-6 items-center">
                    <FormControlLabel 
                      control={<Switch checked={formData.visibleInMenu} onChange={(e) => handleChange('visibleInMenu', e.target.checked)} color="primary" />}
                      label={<span className="text-slate-300 text-sm">Visível Menu</span>}
                    />
                    <FormControlLabel 
                      control={<Switch checked={formData.showInDashboard} onChange={(e) => handleChange('showInDashboard', e.target.checked)} color="secondary" />}
                      label={<span className="text-slate-300 text-sm">Dashboard</span>}
                    />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT: LIVE PREVIEW RESUMO */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Typography variant="h6" className="text-slate-300 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-indigo-400" />
              Painel Resumo (Live)
            </Typography>
            
            <Card 
              sx={{ 
                bgcolor: 'rgba(15, 23, 42, 0.8)', 
                backdropFilter: 'blur(20px)', 
                borderRadius: 4, 
                border: `1px solid ${formData.color}50`,
                boxShadow: `0 10px 40px -10px ${formData.color}40`,
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: formData.color }} 
              />
              <CardContent className="p-6 space-y-6">
                
                <div className="flex justify-between items-start">
                  <div 
                    className="p-3 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${formData.color}20`, color: formData.color }}
                  >
                    {SelectedIcon}
                  </div>
                  <Chip 
                    label={formData.status} 
                    size="small" 
                    icon={getStatusIcon(formData.status)}
                    sx={{ 
                      bgcolor: `${getStatusColor(formData.status)}20`, 
                      color: getStatusColor(formData.status),
                      fontWeight: 'bold',
                      border: `1px solid ${getStatusColor(formData.status)}50`
                    }} 
                  />
                </div>

                <div>
                  <Typography variant="h5" className="text-white font-bold leading-tight break-words">
                    {formData.name || 'Nome da Funcionalidade'}
                  </Typography>
                  <Typography variant="body2" className="text-slate-400 font-mono mt-1">
                    {formData.code}
                  </Typography>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider">Módulo</span>
                    <span className="text-slate-200">{formData.module}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider">Categoria</span>
                    <span className="text-slate-200">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider">Prioridade</span>
                    <span style={{ color: getPriorityTextColor(formData.priority), fontWeight: 'bold' }}>
                      {formData.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase tracking-wider">Versão</span>
                    <span className="text-slate-200">{formData.version}</span>
                  </div>
                </div>

                {formData.description && (
                  <div className="pt-4 border-t border-slate-800">
                    <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Resumo</span>
                    <Typography variant="body2" className="text-slate-300 line-clamp-3">
                      {formData.description}
                    </Typography>
                  </div>
                )}

                {(formData.tags || formData.permissions.length > 0) && (
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
                    {formData.permissions.slice(0,3).map(p => (
                      <Chip key={p} label={p} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.7rem' }} />
                    ))}
                    {formData.permissions.length > 3 && <Chip label={`+${formData.permissions.length-3}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.7rem' }} />}
                  </div>
                )}

                {/* AUDITORIA READONLY */}
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-xs text-slate-500 space-y-1 mt-4">
                  <div className="flex justify-between">
                    <span>Criado por:</span> <span className="text-slate-300">Admin (Mock)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Criação:</span> <span className="text-slate-300">{new Date(formData.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última Alt.:</span> <span className="text-slate-300">{new Date(formData.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Tabela Inferior */}
      <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h6" className="text-white font-semibold">Funcionalidades Cadastradas</Typography>
            <div className="flex items-center bg-slate-800/50 rounded-lg px-3 py-1.5 w-72 border border-slate-700">
              <Search className="text-slate-500 mr-2 h-4 w-4" />
              <input
                type="text"
                className="bg-transparent border-none text-white text-sm outline-none w-full"
                placeholder="Pesquisar por nome, código..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm tracking-wider uppercase bg-slate-900/30">
                  <th className="p-4 font-semibold">Código</th>
                  <th className="p-4 font-semibold">Nome</th>
                  <th className="p-4 font-semibold">Módulo</th>
                  <th className="p-4 font-semibold">Categoria</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Prioridade</th>
                  <th className="p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFeatures.map(f => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{f.code}</td>
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }}></div>
                      {f.name}
                    </td>
                    <td className="p-4 text-slate-300">{f.module}</td>
                    <td className="p-4 text-slate-300">{f.category}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max" style={{ backgroundColor: `${getStatusColor(f.status)}20`, color: getStatusColor(f.status), border: `1px solid ${getStatusColor(f.status)}50`}}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold" style={{ color: getPriorityTextColor(f.priority) }}>
                        {f.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleEdit(f)} sx={{ color: '#94a3b8', '&:hover': { color: '#60a5fa' } }}>
                            <Edit2 size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duplicar">
                          <IconButton size="small" onClick={() => handleDuplicate(f)} sx={{ color: '#94a3b8', '&:hover': { color: '#10b981' } }}>
                            <Copy size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton size="small" onClick={() => setDeleteId(f.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' } }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredFeatures.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Nenhuma funcionalidade encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Confirmação Exclusão */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} sx={{ '& .MuiDialog-paper': { bgcolor: '#0f172a', color: 'white', border: '1px solid #334155' } }}>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <AlertCircle /> Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography className="text-slate-300">
            Tem certeza que deseja excluir esta funcionalidade? Esta ação não poderá ser desfeita e todas as referências a ela serão impactadas.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-800">
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#94a3b8' }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
};
