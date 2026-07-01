import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Tooltip, CircularProgress
} from '@mui/material';
import { Settings, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Module, Category } from '../services/api';
import { ModuleService, CategoryService } from '../services/api';

export const ConfiguracaoModulosCategorias: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Module Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({});
  
  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});

  const [deleteDialog, setDeleteDialog] = useState<{ type: 'module' | 'category', id: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mods, cats] = await Promise.all([
        ModuleService.getAll(),
        CategoryService.getAll()
      ]);
      setModules(mods);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Module Handlers
  const handleSaveModule = async () => {
    try {
      await ModuleService.create(currentModule as Module);
      setModuleModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar módulo');
    }
  };

  // Category Handlers
  const handleSaveCategory = async () => {
    try {
      await CategoryService.create(currentCategory as Category);
      setCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar categoria');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog) return;
    try {
      if (deleteDialog.type === 'module') {
        await ModuleService.delete(deleteDialog.id);
      } else {
        await CategoryService.delete(deleteDialog.id);
      }
      setDeleteDialog(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert(`Erro ao excluir ${deleteDialog.type === 'module' ? 'módulo' : 'categoria'}. Pode estar em uso.`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8 text-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-indigo-400" size={32} />
        <div>
          <Typography variant="h4" className="text-white font-bold tracking-tight">
            Configurações da Plataforma
          </Typography>
          <Typography variant="body2" className="text-slate-400">
            Gerencie Módulos e Categorias globais do sistema.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Modules Card */}
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
              <Typography variant="h6" className="text-white font-semibold">Módulos</Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => { setCurrentModule({}); setModuleModalOpen(true); }}
                sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
              >
                <Plus size={16} className="mr-1" /> Novo Módulo
              </Button>
            </div>
            
            <div className="space-y-3">
              {modules.map(mod => (
                <div key={mod.id} className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                  <div>
                    <Typography className="text-white font-medium">{mod.name}</Typography>
                    {mod.description && <Typography variant="body2" className="text-slate-400 text-sm">{mod.description}</Typography>}
                  </div>
                  <div className="flex gap-2">
                    <Tooltip title="Excluir">
                      <IconButton size="small" onClick={() => setDeleteDialog({ type: 'module', id: mod.id! })} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {modules.length === 0 && <Typography className="text-slate-500 text-center py-4">Nenhum módulo cadastrado.</Typography>}
            </div>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
              <Typography variant="h6" className="text-white font-semibold">Categorias</Typography>
              <Button 
                variant="contained" 
                size="small"
                onClick={() => { setCurrentCategory({}); setCategoryModalOpen(true); }}
                sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
              >
                <Plus size={16} className="mr-1" /> Nova Categoria
              </Button>
            </div>
            
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
                  <div>
                    <Typography className="text-white font-medium">{cat.name}</Typography>
                    {cat.description && <Typography variant="body2" className="text-slate-400 text-sm">{cat.description}</Typography>}
                  </div>
                  <div className="flex gap-2">
                    <Tooltip title="Excluir">
                      <IconButton size="small" onClick={() => setDeleteDialog({ type: 'category', id: cat.id! })} sx={{ color: '#94a3b8', '&:hover': { color: '#f87171' } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <Typography className="text-slate-500 text-center py-4">Nenhuma categoria cadastrada.</Typography>}
            </div>
          </CardContent>
        </Card>

      </div>

      <Dialog open={moduleModalOpen} onClose={() => setModuleModalOpen(false)} sx={{ '& .MuiDialog-paper': { bgcolor: '#0f172a', color: 'white', border: '1px solid #334155', minWidth: '400px' } }}>
        <DialogTitle>Novo Módulo</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField 
            label="Nome do Módulo" 
            value={currentModule.name || ''}
            onChange={(e) => setCurrentModule({ ...currentModule, name: e.target.value })}
            fullWidth 
            variant="outlined"
            size="small"
            sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' }, mt: 1 }}
          />
          <TextField 
            label="Descrição" 
            value={currentModule.description || ''}
            onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
            fullWidth 
            multiline
            rows={3}
            variant="outlined"
            size="small"
            sx={{ textarea: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-800">
          <Button onClick={() => setModuleModalOpen(false)} sx={{ color: '#94a3b8' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveModule} sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} sx={{ '& .MuiDialog-paper': { bgcolor: '#0f172a', color: 'white', border: '1px solid #334155', minWidth: '400px' } }}>
        <DialogTitle>Nova Categoria</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField 
            label="Nome da Categoria" 
            value={currentCategory.name || ''}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            fullWidth 
            variant="outlined"
            size="small"
            sx={{ input: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' }, mt: 1 }}
          />
          <TextField 
            label="Descrição" 
            value={currentCategory.description || ''}
            onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
            fullWidth 
            multiline
            rows={3}
            variant="outlined"
            size="small"
            sx={{ textarea: { color: 'white' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-800">
          <Button onClick={() => setCategoryModalOpen(false)} sx={{ color: '#94a3b8' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveCategory} sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} sx={{ '& .MuiDialog-paper': { bgcolor: '#0f172a', color: 'white', border: '1px solid #334155' } }}>
        <DialogTitle className="flex items-center gap-2 text-red-400">
          <AlertCircle /> Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography className="text-slate-300">
            Tem certeza que deseja excluir este {deleteDialog?.type === 'module' ? 'módulo' : 'categoria'}? Se houver funcionalidades vinculadas, a exclusão falhará.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-800">
          <Button onClick={() => setDeleteDialog(null)} sx={{ color: '#94a3b8' }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}>
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
