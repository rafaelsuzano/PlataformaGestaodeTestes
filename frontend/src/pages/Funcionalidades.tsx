import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, TextField, MenuItem, 
  RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, 
  Switch, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Chip, Box, Tooltip, CircularProgress
} from '@mui/material';
import { 
  Plus, Save, X, Search, Edit2, Copy, Trash2, 
  Code, Database, Globe, LayoutDashboard, Users, Activity, PlaySquare, Settings, CheckCircle2, AlertCircle, StopCircle, Archive
} from 'lucide-react';
import type { Feature, Module, Category, TestCase } from '../services/api';
import { FeatureService, ModuleService, CategoryService, TestCaseService } from '../services/api';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  moduleId: '',
  categoryId: '',
  code: '',
  name: '',
  description: '',
  objective: '',
  status: 'Em Desenvolvimento',
  priority: 'Média',
  version: '1.0.0',
  permissions: 'QA,Administrador',
  dependencies: '',
  tags: '',
  iconName: 'Código',
  color: '#6366f1',
  menuOrder: 1,
  url: '/',
  visibleInMenu: true,
  showInDashboard: true,
};

export const Funcionalidades: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Feature>(INITIAL_FEATURE);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feats, mods, cats, tcs] = await Promise.all([
        FeatureService.getAll(),
        ModuleService.getAll(),
        CategoryService.getAll(),
        TestCaseService.getAll()
      ]);
      setFeatures(feats);
      setModules(mods);
      setCategories(cats);
      setTestCases(tcs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleChange = (field: keyof Feature, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (perm: string) => {
    const currentPerms = formData.permissions ? formData.permissions.split(',').filter(p => p.trim()) : [];
    const newPerms = currentPerms.includes(perm)
      ? currentPerms.filter(p => p !== perm)
      : [...currentPerms, perm];
    handleChange('permissions', newPerms.join(','));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.moduleId || !formData.categoryId) {
      alert("Nome, Módulo e Categoria são obrigatórios!");
      return;
    }
    
    try {
      await FeatureService.create(formData);
      fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar funcionalidade');
    }
  };

  const handleEdit = (feature: Feature) => {
    setFormData(feature);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicate = (feature: Feature) => {
    setFormData({ 
      ...feature, 
      id: undefined, 
      code: `${feature.code || ''}-COPY`, 
      name: `${feature.name} (Cópia)` 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await FeatureService.delete(deleteId);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir funcionalidade');
      } finally {
        setDeleteId(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({ ...INITIAL_FEATURE, code: `FUNC-00${features.length + 1}` });
  };

  const handleView = (feature: Feature) => {
    setSelectedFeature(feature);
    setViewOpen(true);
  };

  const getLinkedTestCases = (featureId: string) => {
    return testCases?.filter(tc => tc.featureId === featureId) || [];
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
  const getStatusColor = (status: string | null | undefined) => {
    switch(status) {
      case 'Ativa': return '#10b981'; // Emerald
      case 'Em Desenvolvimento': return '#3b82f6'; // Blue
      case 'Inativa': return '#f59e0b'; // Amber
      case 'Descontinuada': return '#ef4444'; // Red
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    switch(status) {
      case 'Ativa': return <CheckCircle2 size={16} />;
      case 'Em Desenvolvimento': return <Activity size={16} />;
      case 'Inativa': return <StopCircle size={16} />;
      case 'Descontinuada': return <Archive size={16} />;
      default: return undefined;
    }
  };

  const getPriorityColor = (priority: string | null | undefined) => {
    switch(priority) {
      case 'Baixa': return 'rgba(59, 130, 246, 0.2)'; // Blue
      case 'Média': return 'rgba(245, 158, 11, 0.2)'; // Amber
      case 'Alta': return 'rgba(249, 115, 22, 0.2)'; // Orange
      case 'Crítica': return 'rgba(239, 68, 68, 0.2)'; // Red
      default: return 'transparent';
    }
  };
  
  const getPriorityTextColor = (priority: string | null | undefined) => {
    switch(priority) {
      case 'Baixa': return '#60a5fa'; 
      case 'Média': return '#fbbf24'; 
      case 'Alta': return '#fb923c'; 
      case 'Crítica': return '#f87171'; 
      default: return '#cbd5e1';
    }
  };

  const currentPermsList = formData.permissions ? formData.permissions.split(',').filter(p => p.trim()) : [];

  // Filtro
  const filteredFeatures = features.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModuleName = (id: string) => modules.find(m => m.id === id)?.name || id;
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;

  if (loading) {
    return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
  }

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

      {/* FORMULARIO */}
      <div className="space-y-6">
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
                  label="Código" 
                  value={formData.code || ''}
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
                  label="Módulo *" 
                  value={formData.moduleId}
                  onChange={(e) => handleChange('moduleId', e.target.value)}
                  fullWidth 
                  variant="outlined"
                  size="small"
                  slotProps={{ select: { style: { color: 'white' } } }}
                  sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                >
                  {modules.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                </TextField>
                <TextField 
                  select
                  label="Categoria *" 
                  value={formData.categoryId || ''}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  fullWidth 
                  variant="outlined"
                  size="small"
                  slotProps={{ select: { style: { color: 'white' } } }}
                  sx={{ '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                >
                  {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
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
                  value={formData.objective || ''}
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
                    value={formData.status || 'Em Desenvolvimento'} 
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
                    value={formData.version || ''}
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
                          checked={currentPermsList.includes(perm)}
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
                  value={formData.dependencies || ''}
                  onChange={(e) => handleChange('dependencies', e.target.value)}
                  placeholder="Ex: Gestão de Projetos, Automação"
                  fullWidth 
                  variant="outlined"
                  size="small"
                  sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField 
                  label="Tags (separadas por vírgula)" 
                  value={formData.tags || ''}
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
                    value={formData.iconName || 'Código'}
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
                    value={formData.color || '#6366f1'}
                    onChange={(e) => handleChange('color', e.target.value)}
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { height: '24px', cursor: 'pointer' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />

                  <TextField 
                    label="Ordem no Menu" 
                    type="number"
                    value={formData.menuOrder || 0}
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
                    value={formData.url || ''}
                    onChange={(e) => handleChange('url', e.target.value)}
                    placeholder="/minha-funcionalidade"
                    fullWidth 
                    variant="outlined"
                    size="small"
                    sx={{ input: { color: 'white', fontFamily: 'monospace' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                  />
                  <div className="flex gap-6 items-center">
                    <FormControlLabel 
                      control={<Switch checked={!!formData.visibleInMenu} onChange={(e) => handleChange('visibleInMenu', e.target.checked)} color="primary" />}
                      label={<span className="text-slate-300 text-sm">Visível Menu</span>}
                    />
                    <FormControlLabel 
                      control={<Switch checked={!!formData.showInDashboard} onChange={(e) => handleChange('showInDashboard', e.target.checked)} color="secondary" />}
                      label={<span className="text-slate-300 text-sm">Dashboard</span>}
                    />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
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
                  <th className="p-4 font-semibold">Cobertura</th>
                  <th className="p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredFeatures.map(f => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{f.code}</td>
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color || '#6366f1' }}></div>
                      {f.name}
                    </td>
                    <td className="p-4 text-slate-300">{getModuleName(f.moduleId)}</td>
                    <td className="p-4 text-slate-300">{getCategoryName(f.categoryId || '')}</td>
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
                      <Chip 
                        label={`${getLinkedTestCases(f.id!).length} TC(s)`} 
                        size="small" 
                        color={getLinkedTestCases(f.id!).length > 0 ? "success" : "default"} 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Tooltip title="Visualizar">
                          <IconButton size="small" onClick={() => handleView(f)} sx={{ color: '#94a3b8', '&:hover': { color: '#818cf8' } }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
                          <IconButton size="small" onClick={() => setDeleteId(f.id!)} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' } }}>
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
            Tem certeza que deseja excluir esta funcionalidade? Esta ação não poderá ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-800">
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#94a3b8' }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal - Visualizar Funcionalidade e Rastreabilidade */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { bgcolor: '#0f172a', color: 'white', border: '1px solid #334155' } }}>
        <DialogTitle>Funcionalidade: {selectedFeature?.code}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ color: 'white' }}>{selectedFeature?.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, color: '#94a3b8' }}>Módulo: {getModuleName(selectedFeature?.moduleId || '')}</Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #334155', pb: 1, color: 'white' }}>
            Rastreabilidade (Matriz de Cobertura)
          </Typography>
          
          {selectedFeature && getLinkedTestCases(selectedFeature.id!).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/50 text-slate-400 text-sm bg-slate-900/30">
                    <th className="p-2 font-semibold">Caso de Teste</th>
                    <th className="p-2 font-semibold">Tipo</th>
                    <th className="p-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {getLinkedTestCases(selectedFeature.id!).map(tc => (
                    <tr key={tc.id} className="border-b border-slate-800/50">
                      <td className="p-2 font-medium text-slate-300">{tc.title}</td>
                      <td className="p-2"><Chip label={tc.type} size="small" sx={{ color: 'white', bgcolor: '#334155' }} /></td>
                      <td className="p-2 text-slate-400">{tc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography variant="body2" sx={{ py: 2, color: '#94a3b8' }}>
              Nenhum Caso de Teste vinculado a esta funcionalidade ainda. (Vincule lá na tela de Casos de Teste)
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #334155' }}>
          <Button onClick={() => setViewOpen(false)} variant="contained" sx={{ bgcolor: '#334155' }}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};
