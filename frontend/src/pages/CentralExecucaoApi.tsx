import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleFilledWhite';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { ApiTestPlanService, ProjectService, TestCaseService } from '../services/api';

export default function CentralExecucaoApi() {
  const queryClient = useQueryClient();
  const [executingPlan, setExecutingPlan] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanProjectId, setNewPlanProjectId] = useState('');
  const [newPlanTestCaseId, setNewPlanTestCaseId] = useState('');
  
  const { data: plans, isLoading: loadPlans } = useQuery({ queryKey: ['apiTestPlans'], queryFn: ApiTestPlanService.getAll });
  const { data: recentExecutions } = useQuery({ queryKey: ['apiTestExecutions'], queryFn: ApiTestPlanService.getRecentExecutions });
  const { data: projects, isLoading: loadProjects } = useQuery({ queryKey: ['projects'], queryFn: ProjectService.getAll });
  const { data: testCases, isLoading: loadTestCases } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });

  const executeMutation = useMutation({
    mutationFn: ApiTestPlanService.executePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiTestExecutions'] });
      setExecutingPlan(null);
    },
    onError: () => setExecutingPlan(null)
  });

  const createMutation = useMutation({
    mutationFn: ApiTestPlanService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiTestPlans'] });
      setOpenDialog(false);
      setNewPlanName('');
      setNewPlanDesc('');
      setNewPlanProjectId('');
      setNewPlanTestCaseId('');
    }
  });

  const handleExecute = (id: string) => {
    setExecutingPlan(id);
    executeMutation.mutate(id);
  };

  if (loadPlans || loadProjects || loadTestCases) return <CircularProgress />;

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Central de Execução de APIs</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<LibraryAddCheckIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Novo Plano de Teste
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" gutterBottom>Planos de Teste (Collections)</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome do Plano</TableCell>
                  <TableCell>Requisições</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans?.length === 0 && (
                  <TableRow><TableCell colSpan={3} align="center">Nenhum plano cadastrado. Salve requisições no Testador de API.</TableCell></TableRow>
                )}
                {plans?.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{plan.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{plan.description}</Typography>
                    </TableCell>
                    <TableCell>{plan.requests?.length || 0} APIs</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        color="success" 
                        startIcon={executingPlan === plan.id ? <CircularProgress size={20} /> : <PlayCircleOutlineIcon />}
                        disabled={executingPlan === plan.id || !plan.requests?.length}
                        onClick={() => handleExecute(plan.id!)}
                      >
                        Executar Bateria
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" gutterBottom>Últimas Execuções</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentExecutions?.map((exec) => {
              const p = plans?.find(x => x.id === exec.planId);
              const isPassed = exec.status === 'PASSED';
              return (
                <Card key={exec.id} sx={{ 
                  borderLeft: `4px solid ${isPassed ? '#10B981' : '#EF4444'}`,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateX(4px)' }
                }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#E2E8F0' }}>{p?.name || 'Desconhecido'}</Typography>
                      <Chip 
                        label={`${exec.successRate}%`} 
                        size="small" 
                        sx={{ 
                          bgcolor: isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: isPassed ? '#34d399' : '#f87171', 
                          border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                          fontWeight: 'bold'
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="#94A3B8">Tempo Total: {exec.executionTimeMs}ms</Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.4)">{new Date(exec.createdAt).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              );
            })}
            {!recentExecutions?.length && <Typography color="text.secondary">Nenhuma execução registrada.</Typography>}
          </Box>
        </Grid>
      </Grid>

      {/* Dialog for New Plan */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Novo Plano de Teste</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField 
              label="Nome do Plano" 
              fullWidth 
              value={newPlanName} 
              onChange={e => setNewPlanName(e.target.value)} 
            />
            <TextField 
              label="Descrição (Opcional)" 
              fullWidth 
              multiline 
              rows={3} 
              value={newPlanDesc} 
              onChange={e => setNewPlanDesc(e.target.value)} 
            />
            <FormControl fullWidth>
              <InputLabel>Projeto Relacionado</InputLabel>
              <Select
                value={newPlanProjectId}
                label="Projeto Relacionado"
                onChange={e => setNewPlanProjectId(e.target.value)}
              >
                {projects?.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Vincular a Caso de Teste (Opcional)</InputLabel>
              <Select
                value={newPlanTestCaseId}
                label="Vincular a Caso de Teste (Opcional)"
                onChange={e => setNewPlanTestCaseId(e.target.value)}
                disabled={!newPlanProjectId}
              >
                <MenuItem value=""><em>Nenhum</em></MenuItem>
                {testCases?.filter(tc => tc.type === 'API' || !tc.type).map(tc => (
                  <MenuItem key={tc.id} value={tc.id}>{tc.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!newPlanName.trim() || !newPlanProjectId || createMutation.isPending}
            onClick={() => createMutation.mutate({ 
              name: newPlanName, 
              description: newPlanDesc,
              projectId: newPlanProjectId,
              testCaseId: newPlanTestCaseId || undefined
            })}
          >
            {createMutation.isPending ? <CircularProgress size={24} /> : 'Salvar Plano'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
