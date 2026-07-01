import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, CircularProgress, Chip, Tooltip,
  TablePagination, Divider
} from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Editor from '@monaco-editor/react';
import { TestCaseService, RequirementService, AiService, ProjectService, TestCaseFolderService } from '../services/api';
import type { TestCase, Requirement, TestCaseFolder } from '../services/api';

const DEFAULT_FORM_DATA = {
  featureId: null, requirementId: '', title: '', description: '', type: 'BDD', status: 'DRAFT', gherkinContent: 'Feature: ...\n\n  Scenario: ...\n    Given ...\n    When ...\n    Then ...'
};

export default function CasosTeste() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<TestCase>>(DEFAULT_FORM_DATA);
  const [viewData, setViewData] = useState<TestCase | null>(null);
  
  // States para Projetos e Pastas
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderFormData, setFolderFormData] = useState<{id?: string; name: string; parentId: string | null}>({ name: '', parentId: null });

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Passos Manuais
  const [manualSteps, setManualSteps] = useState<{action: string; expected: string}[]>([{ action: '', expected: '' }]);

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAll
  });

  const { data: testCases, isLoading } = useQuery({
    queryKey: ['testCases'],
    queryFn: TestCaseService.getAll
  });

  const { data: requirements } = useQuery({
    queryKey: ['requirements'],
    queryFn: RequirementService.getAll
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['testCaseFolders', selectedProjectId],
    queryFn: () => TestCaseFolderService.getAll(selectedProjectId),
    enabled: !!selectedProjectId
  });

  // Mutations Test Cases
  const createMutation = useMutation({
    mutationFn: TestCaseService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCases'] }); setOpen(false); }
  });

  const updateMutation = useMutation({
    mutationFn: TestCaseService.update,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCases'] }); setOpen(false); }
  });

  const deleteMutation = useMutation({
    mutationFn: TestCaseService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCases'] }); }
  });

  // Mutations Folders
  const createFolderMutation = useMutation({
    mutationFn: TestCaseFolderService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCaseFolders'] }); setFolderOpen(false); }
  });

  const updateFolderMutation = useMutation({
    mutationFn: TestCaseFolderService.update,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCaseFolders'] }); setFolderOpen(false); }
  });

  const deleteFolderMutation = useMutation({
    mutationFn: TestCaseFolderService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testCaseFolders'] }); setSelectedFolderId(null); }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    const testCaseId = e.dataTransfer.getData('text/plain');
    if (testCaseId && testCases) {
      const tc = testCases.find(t => t.id === testCaseId);
      if (tc && tc.folderId !== targetFolderId) {
        updateMutation.mutate({ ...tc, folderId: targetFolderId } as TestCase);
      }
    }
  };

  // Render Tree recursively
  const renderTree = (nodes: TestCaseFolder[]) => {
    return nodes.map((node) => {
      const children = folders?.filter(f => f.parentId === node.id) || [];
      return (
        <TreeItem key={node.id} itemId={node.id!} label={
          <Box 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, node.id!)}
            sx={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1,
              transition: 'background-color 0.2s',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <FolderIcon sx={{ color: selectedFolderId === node.id ? '#a855f7' : '#6366f1' }} fontSize="small" />
              <Typography variant="body2" sx={{ 
                fontWeight: selectedFolderId === node.id ? 'bold' : 'normal',
                color: selectedFolderId === node.id ? '#a855f7' : '#e2e8f0'
              }}>
                {node.name}
              </Typography>
            </Box>
          </Box>
        }>
          {children.length > 0 ? renderTree(children) : null}
        </TreeItem>
      );
    });
  };
  
  const rootFolders = folders?.filter(f => !f.parentId) || [];

  const handleOpenNewFolder = (parentId: string | null = null) => {
    setFolderFormData({ name: '', parentId });
    setIsEditing(false);
    setFolderOpen(true);
  };

  const handleEditFolder = () => {
    const folder = folders?.find(f => f.id === selectedFolderId);
    if (folder) {
      setFolderFormData({ id: folder.id, name: folder.name, parentId: folder.parentId || null });
      setIsEditing(true);
      setFolderOpen(true);
    }
  };

  const handleDeleteFolder = () => {
    if (selectedFolderId && window.confirm('Deseja excluir esta pasta?')) {
      deleteFolderMutation.mutate(selectedFolderId);
    }
  };

  const submitFolder = () => {
    if (isEditing) {
      updateFolderMutation.mutate({ ...folderFormData, projectId: selectedProjectId } as TestCaseFolder);
    } else {
      createFolderMutation.mutate({ ...folderFormData, projectId: selectedProjectId } as TestCaseFolder);
    }
  };

  const getStatusChip = (status: string) => {
    switch(status) {
      case 'ATIVO': return <Chip label={status} size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }} />;
      case 'DRAFT': return <Chip label={status} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)' }} />;
      case 'OBSOLETO': return <Chip label={status} size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.title) return;
    setAiLoading(true);
    try {
      const req = requirements?.find(r => r.id === formData.requirementId);
      const reqContext = req ? ` (Requisito: ${req.title})` : '';
      const context = formData.title + reqContext;
      const bdd = await AiService.generateBdd(context);
      setFormData(prev => ({ ...prev, preConditions: bdd.preConditions, steps: bdd.steps, expectedResult: bdd.expectedResult }));
    } catch (err) {
      console.error("Erro ao gerar BDD via IA:", err);
    }
    setAiLoading(false);
  };

  const handleSubmit = () => {
    const finalFolderId = formData.folderId === 'root' ? null : formData.folderId;
    const dataToSave = { ...formData, folderId: finalFolderId };
    if (dataToSave.type === 'MANUAL') {
      dataToSave.description = JSON.stringify(manualSteps);
    }
    if (isEditing) {
      updateMutation.mutate(dataToSave as TestCase);
    } else {
      createMutation.mutate(dataToSave as TestCase);
    }
  };

  const handleEdit = (tc: TestCase) => {
    setFormData(tc);
    if (tc.type === 'MANUAL' && tc.description) {
      try {
        const parsed = JSON.parse(tc.description);
        if (Array.isArray(parsed)) setManualSteps(parsed);
        else setManualSteps([{ action: tc.description, expected: '' }]);
      } catch(e) {
        setManualSteps([{ action: tc.description, expected: '' }]);
      }
    } else {
      setManualSteps([{ action: '', expected: '' }]);
    }
    setIsEditing(true);
    setOpen(true);
  };

  const handleView = (tc: TestCase) => {
    setViewData(tc);
    setViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) deleteMutation.mutate(id);
  };

  const handleOpenNew = () => {
    setFormData({ ...DEFAULT_FORM_DATA, folderId: (selectedFolderId === 'root' ? null : selectedFolderId) });
    setManualSteps([{ action: '', expected: '' }]);
    setIsEditing(false);
    setOpen(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  // Filter test cases by selected folder (or all if null/'root')
  const filteredTestCases = useMemo(() => {
    if (!testCases) return [];
    if (!selectedFolderId || selectedFolderId === 'root') return testCases; // Mostra todos os casos na raiz
    return testCases.filter(tc => tc.folderId === selectedFolderId);
  }, [testCases, selectedFolderId]);

  const paginatedTestCases = filteredTestCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id!);
    }
  }, [projects, selectedProjectId]);

  return (
    <Box sx={{ minWidth: 800, pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Gestão de Casos de Teste</Typography>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel>Projeto</InputLabel>
          <Select
            value={selectedProjectId}
            label="Projeto"
            onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedFolderId(null); }}
          >
            {projects?.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
        {/* Left Pane - Tree View */}
        <Box sx={{ flex: '0 0 240px', width: 240 }}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Estrutura</Typography>
              <Box>
                <Tooltip title="Nova Pasta Raiz">
                  <span>
                    <IconButton size="small" onClick={() => handleOpenNewFolder(null)} disabled={!selectedProjectId}>
                      <CreateNewFolderIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {foldersLoading ? <CircularProgress size={24} /> : (
                <SimpleTreeView
                  selectedItems={selectedFolderId || 'root'}
                  onSelectedItemsChange={(_e, id) => setSelectedFolderId(id as string | null)}
                  defaultExpandedItems={['root']}
                >
                  <TreeItem 
                    itemId="root" 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, pr: 1 }}>
                        <FolderIcon sx={{ color: (!selectedFolderId || selectedFolderId === 'root') ? '#ec4899' : '#94a3b8' }} fontSize="small" />
                        <Typography variant="body2" sx={{ 
                          fontWeight: (!selectedFolderId || selectedFolderId === 'root') ? 'bold' : 'normal',
                          color: (!selectedFolderId || selectedFolderId === 'root') ? '#ec4899' : '#e2e8f0'
                        }}>
                          Raiz do Projeto (Todos)
                        </Typography>
                      </Box>
                    }
                  >
                    {renderTree(rootFolders)}
                  </TreeItem>
                </SimpleTreeView>
              )}
            </Box>
            
            {selectedFolderId && selectedFolderId !== 'root' && (
              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Tooltip title="Nova Sub-pasta">
                  <IconButton size="small" color="primary" onClick={() => handleOpenNewFolder(selectedFolderId)}><AddIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Renomear Pasta">
                  <IconButton size="small" onClick={handleEditFolder}><EditIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Excluir Pasta">
                  <IconButton size="small" color="error" onClick={handleDeleteFolder}><DeleteIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right Pane - Test Cases Table */}
        <Box sx={{ flex: 1, minWidth: 500 }}>
          <Paper sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Casos de Teste {(!selectedFolderId || selectedFolderId === 'root') ? '(Todos)' : `- ${folders?.find(f => f.id === selectedFolderId)?.name}`}
              </Typography>
              <Button 
                variant="contained" 
                size="small" 
                onClick={handleOpenNew}
              >
                Novo Caso de Teste
              </Button>
            </Box>

            <TableContainer sx={{ flexGrow: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    {(!selectedFolderId || selectedFolderId === 'root') && <TableCell>Diretório</TableCell>}
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell width={150}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={24} sx={{ my: 2 }} /></TableCell></TableRow>
                  ) : paginatedTestCases.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>Nenhum caso de teste encontrado nesta pasta.</TableCell></TableRow>
                  ) : (
                    paginatedTestCases.map((tc) => (
                      <TableRow 
                        key={tc.id} 
                        hover
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', tc.id!);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
                      >
                        <TableCell>{tc.title}</TableCell>
                        {(!selectedFolderId || selectedFolderId === 'root') && (
                          <TableCell>
                            <Chip 
                              label={tc.folderId ? (folders?.find(f => f.id === tc.folderId)?.name || 'Desconhecido') : 'Raiz'} 
                              size="small" 
                              sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontSize: '0.7rem' }} 
                            />
                          </TableCell>
                        )}
                        <TableCell>{tc.type}</TableCell>
                        <TableCell>{getStatusChip(tc.status || 'DRAFT')}</TableCell>
                        <TableCell>
                          <Tooltip title="Visualizar">
                            <IconButton size="small" onClick={() => handleView(tc)}><VisibilityIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" color="primary" onClick={() => handleEdit(tc)}><EditIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => tc.id && handleDelete(tc.id)}><DeleteIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTestCases.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Por página:"
            />
          </Paper>
        </Box>
      </Box>

      {/* Modal - Folder */}
      <Dialog open={folderOpen} onClose={() => setFolderOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{isEditing ? 'Renomear Pasta' : 'Nova Pasta'}</DialogTitle>
        <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Nome da Pasta" 
            fullWidth 
            value={folderFormData.name} 
            onChange={e => setFolderFormData({...folderFormData, name: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderOpen(false)}>Cancelar</Button>
          <Button onClick={submitFolder} variant="contained" disabled={!folderFormData.name}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal - Test Case */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Editar Caso de Teste' : 'Novo Caso de Teste'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Requisito Vinculado</InputLabel>
            <Select
              value={formData.requirementId || ''}
              label="Requisito Vinculado"
              onChange={e => setFormData({...formData, requirementId: e.target.value as string})}
            >
              <MenuItem value="">Nenhum</MenuItem>
              {requirements?.map((req: Requirement) => (
                <MenuItem key={req.id} value={req.id}>{req.code} - {req.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Pasta (Diretório)</InputLabel>
            <Select
              value={formData.folderId || 'root'}
              label="Pasta (Diretório)"
              onChange={e => setFormData({...formData, folderId: e.target.value === 'root' ? null : e.target.value})}
            >
              <MenuItem value="root">Raiz do Projeto (Sem Pasta)</MenuItem>
              {folders?.map((f: TestCaseFolder) => (
                <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField margin="dense" label="Título" fullWidth value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Geração de Cenários</Typography>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={aiLoading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
              onClick={handleAiGenerate}
              disabled={!formData.title || aiLoading}
              sx={{ borderRadius: 4, textTransform: 'none' }}
            >
              🪄 Gerar BDD com IA
            </Button>
          </Box>

          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.type || 'AUTOMATED'}
              label="Tipo"
              onChange={e => setFormData({...formData, type: e.target.value as string})}
            >
              <MenuItem value="AUTOMATED">BDD (Automatizado)</MenuItem>
              <MenuItem value="MANUAL">Manual</MenuItem>
              <MenuItem value="BDD">BDD (Legado)</MenuItem>
            </Select>
          </FormControl>

          {formData.type === 'MANUAL' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Passos do Caso de Teste</Typography>
              {manualSteps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, bgcolor: '#f8fafc', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>#{index + 1}</Typography>
                  <TextField 
                    label="Ação / Passo" 
                    fullWidth 
                    size="small"
                    value={step.action} 
                    onChange={e => {
                      const newSteps = [...manualSteps];
                      newSteps[index].action = e.target.value;
                      setManualSteps(newSteps);
                    }} 
                  />
                  <TextField 
                    label="Resultado Esperado" 
                    fullWidth 
                    size="small"
                    value={step.expected} 
                    onChange={e => {
                      const newSteps = [...manualSteps];
                      newSteps[index].expected = e.target.value;
                      setManualSteps(newSteps);
                    }} 
                  />
                  <IconButton 
                    color="error" 
                    onClick={() => {
                      const newSteps = manualSteps.filter((_, i) => i !== index);
                      setManualSteps(newSteps.length ? newSteps : [{ action: '', expected: '' }]);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => setManualSteps([...manualSteps, { action: '', expected: '' }])}
                size="small"
              >
                Adicionar Novo Passo
              </Button>
            </Box>
          )}
          
          {(formData.type === 'BDD' || formData.type === 'AUTOMATED') && (
            <Box sx={{ mt: 2, height: '400px', border: '1px solid #ccc' }}>
              <Typography variant="subtitle2" sx={{ p: 1, bgcolor: '#f5f5f5' }}>Editor Gherkin</Typography>
              <Editor
                height="calc(100% - 40px)"
                defaultLanguage="yaml"
                theme="vs-dark"
                value={formData.gherkinContent}
                onChange={(val) => setFormData({...formData, gherkinContent: val || ''})}
              />
            </Box>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Visualização (Somente Leitura) - Deep Space Glassmorphism */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            color: '#f8fafc',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, pt: 3, px: 4, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Detalhes do Caso de Teste
          </Typography>
          <IconButton onClick={() => setViewOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
             <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {viewData && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>{viewData.title}</Typography>
                {getStatusChip(viewData.status || 'DRAFT')}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 5, p: 2.5, background: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Chip label={`Tipo: ${viewData.type}`} variant="outlined" sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }} />
                {viewData.requirementId && (
                  <Chip label="Requisito Vinculado" variant="outlined" color="primary" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', fontWeight: 600 }} />
                )}
              </Box>

              {viewData.type === 'MANUAL' && viewData.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
                    <AssignmentIcon fontSize="small" sx={{ color: '#60a5fa' }} />
                    Passos Manuais
                  </Typography>
                  <Paper sx={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', borderRadius: 2 }}>
                    <Table size="medium">
                      <TableHead>
                        <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                          <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }} width="60px">#</TableCell>
                          <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>Ação / Passo</TableCell>
                          <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>Resultado Esperado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(() => {
                          try {
                            const steps = JSON.parse(viewData.description);
                            if (Array.isArray(steps)) {
                              return steps.map((s, idx) => (
                                <TableRow key={idx} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                  <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                      {idx + 1}
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.action}</TableCell>
                                  <TableCell sx={{ color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.expected}</TableCell>
                                </TableRow>
                              ));
                            }
                            return <TableRow><TableCell colSpan={3} sx={{ color: '#e2e8f0', borderBottom: 0 }}>{viewData.description}</TableCell></TableRow>;
                          } catch (e) {
                            return <TableRow><TableCell colSpan={3} sx={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', borderBottom: 0 }}>{viewData.description}</TableCell></TableRow>;
                          }
                        })()}
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              )}

              {(viewData.type === 'BDD' || viewData.type === 'AUTOMATED') && viewData.gherkinContent && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 600 }}>
                    <ScienceIcon fontSize="small" sx={{ color: '#a855f7' }} />
                    Cenário BDD (Gherkin)
                  </Typography>
                  <Paper sx={{ 
                    p: 4, 
                    background: '#0d1117', 
                    color: '#a6e22e', 
                    fontFamily: '"Fira Code", monospace', 
                    whiteSpace: 'pre-wrap',
                    borderRadius: 2,
                    border: '1px solid rgba(166, 226, 46, 0.2)',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
                    fontSize: '1rem',
                    lineHeight: 1.6
                  }}>
                    {viewData.gherkinContent}
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
