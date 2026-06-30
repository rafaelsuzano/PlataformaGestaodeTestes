import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, CircularProgress, Chip,
  TablePagination, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ProjectService, SprintService, TestCaseService, TestPlanService } from '../services/api';
import type { TestPlan, CreateTestPlanRequest } from '../services/api';

const DEFAULT_FORM_DATA: TestPlan = {
  projectId: '',
  name: '',
  description: '',
  environment: '',
  status: 'DRAFT'
};

export default function PlanosTeste() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TestPlan>(DEFAULT_FORM_DATA);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: ProjectService.getAll });
  const { data: sprints } = useQuery({ queryKey: ['sprints'], queryFn: SprintService.getAll });
  const { data: allTestCases } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });
  
  const { data: plans, isLoading } = useQuery({ 
    queryKey: ['testPlans', selectedProjectId], 
    queryFn: () => TestPlanService.getByProject(selectedProjectId),
    enabled: !!selectedProjectId
  });

  const createMutation = useMutation({
    mutationFn: TestPlanService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testPlans'] });
      setOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: TestPlanService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testPlans'] });
      setOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: TestPlanService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testPlans'] })
  });

  const getStatusChip = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS': return <Chip label="Em Progresso" size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }} />;
      case 'DRAFT': return <Chip label="Rascunho" size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)' }} />;
      case 'COMPLETED': return <Chip label="Concluído" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      const request: CreateTestPlanRequest = {
        testPlan: { ...formData, projectId: selectedProjectId },
        testCaseIds: selectedTestCases
      };
      createMutation.mutate(request);
    }
  };

  const handleEdit = (plan: TestPlan) => {
    setFormData(plan);
    setSelectedTestCases([]); // Editing test cases inside an existing plan could be complex, for now we just edit the plan metadata
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) deleteMutation.mutate(id);
  };

  const handleOpenNew = () => {
    setFormData({ ...DEFAULT_FORM_DATA, projectId: selectedProjectId });
    setSelectedTestCases([]);
    setIsEditing(false);
    setOpen(true);
  };

  const handleTestCaseToggle = (id: string) => {
    setSelectedTestCases(prev => 
      prev.includes(id) ? prev.filter(tcId => tcId !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const projectTestCases = useMemo(() => {
    if (!allTestCases) return [];
    // Assuming feature -> module -> project mapping exists, but test case doesn't have direct projectId
    // For now we just show all test cases for them to select, but in reality we should filter by project.
    return allTestCases; 
  }, [allTestCases]);

  const projectSprints = useMemo(() => {
    if (!sprints || !selectedProjectId) return [];
    return sprints.filter(s => s.projectId === selectedProjectId);
  }, [sprints, selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId && projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id!);
    }
  }, [projects, selectedProjectId]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Planos de Teste</Typography>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel>Projeto</InputLabel>
          <Select
            value={selectedProjectId}
            label="Projeto"
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects?.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNew}
          disabled={!selectedProjectId}
          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
        >
          Novo Plano de Teste
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Sprint</TableCell>
                  <TableCell>Ambiente</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan) => (
                  <TableRow key={plan.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 500, color: '#e2e8f0' }}>{plan.name}</TableCell>
                    <TableCell>{sprints?.find(s => s.id === plan.sprintId)?.name || '-'}</TableCell>
                    <TableCell>{plan.environment || '-'}</TableCell>
                    <TableCell>{getStatusChip(plan.status)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(plan)} sx={{ color: '#818cf8' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(plan.id!)} sx={{ color: '#f87171' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={plans?.length || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página"
            />
          </>
        )}
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' } }}
      >
        <DialogTitle>{isEditing ? 'Editar Plano de Teste' : 'Novo Plano de Teste'}</DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome do Plano"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sprint Associada</InputLabel>
                <Select
                  value={formData.sprintId || ''}
                  label="Sprint Associada"
                  onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
                >
                  <MenuItem value="">Nenhuma</MenuItem>
                  {projectSprints?.map(s => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Ambiente de Teste</InputLabel>
                <Select
                  value={formData.environment || ''}
                  label="Ambiente de Teste"
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                >
                  <MenuItem value="DEV">Desenvolvimento (DEV)</MenuItem>
                  <MenuItem value="QA">Qualidade (QA)</MenuItem>
                  <MenuItem value="STAGING">Homologação (STAGING)</MenuItem>
                  <MenuItem value="PROD">Produção (PROD)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {!isEditing && (
              <Box sx={{ mt: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Selecionar Casos de Teste para o Plano
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#9ca3af' }}>
                  As execuções pendentes serão geradas automaticamente na Central de Execução para os testes selecionados abaixo.
                </Typography>
                
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">Selec.</TableCell>
                        <TableCell>Título do Caso de Teste</TableCell>
                        <TableCell>Tipo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectTestCases.map((tc) => (
                        <TableRow key={tc.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedTestCases.includes(tc.id!)}
                              onChange={() => handleTestCaseToggle(tc.id!)}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>{tc.title}</TableCell>
                          <TableCell>
                            <Chip label={tc.type} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                      {projectTestCases.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                            Nenhum caso de teste encontrado. Crie casos de teste primeiro.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="DRAFT">Rascunho</MenuItem>
                <MenuItem value="IN_PROGRESS">Em Progresso</MenuItem>
                <MenuItem value="COMPLETED">Concluído</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#9ca3af' }}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={createMutation.isPending || updateMutation.isPending}
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
          >
            {isEditing ? 'Atualizar' : 'Criar Plano e Gerar Execuções'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
