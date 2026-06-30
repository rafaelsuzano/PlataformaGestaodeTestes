import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, Select, MenuItem, InputLabel, FormControl, Chip, TextField, IconButton,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import { TestExecutionService, TestCaseService, EnvironmentService, ExecutionHistoryService } from '../services/api';
import type { TestCase, TestExecution } from '../services/api';

export default function Execucao() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', sprint: '', testCaseIds: [] as string[], status: 'ATIVO', environment: ''
  });

  const [editData, setEditData] = useState<Partial<TestExecution> & { additionalTestCaseIds?: string[] }>({});
  
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [envSelectOpen, setEnvSelectOpen] = useState(false);
  const [runningExec, setRunningExec] = useState<TestExecution | null>(null);
  const [runningTestCase, setRunningTestCase] = useState<TestCase | null>(null);
  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const { data: testCases } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });
  const { data: executions, isLoading } = useQuery({ queryKey: ['executions'], queryFn: TestExecutionService.getAll });
  const { data: environments } = useQuery({ queryKey: ['environments'], queryFn: EnvironmentService.getAll });

  const createMutation = useMutation({
    mutationFn: TestExecutionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
      setOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: TestExecutionService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: TestExecutionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
    }
  });

  const handleCreate = async () => {
    for (const testCaseId of formData.testCaseIds) {
      await createMutation.mutateAsync({
        name: formData.name,
        sprint: formData.sprint,
        testCaseId,
        status: formData.status,
        environment: formData.environment
      });
    }
    setOpen(false);
    setFormData({ name: '', sprint: '', testCaseIds: [], status: 'ATIVO', environment: '' });
  };

  const handleUpdate = async () => {
    if (editData.id) {
      await updateMutation.mutateAsync(editData as TestExecution);
      
      if (editData.additionalTestCaseIds && editData.additionalTestCaseIds.length > 0) {
        for (const testCaseId of editData.additionalTestCaseIds) {
          await createMutation.mutateAsync({
            name: editData.name,
            sprint: editData.sprint,
            testCaseId,
            status: editData.status || 'ATIVO',
            environment: editData.environment || 'QA'
          });
        }
      }
      setEditOpen(false);
    }
  };

  const openEdit = (exec: TestExecution) => {
    setEditData({ ...exec, additionalTestCaseIds: [] });
    setEditOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
      case 'PASSED': return 'success';
      case 'TESTANDO':
      case 'IN_PROGRESS': return 'info';
      case 'FAILED': return 'error';
      case 'BLOCKED': return 'error';
      case 'ATIVO': 
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const handleOpenEnvSelect = (exec: TestExecution, tc: TestCase | undefined) => {
    setRunningExec(exec);
    setRunningTestCase(tc || null);
    setSelectedEnvId('');
    setEnvSelectOpen(true);
  };

  const handleStartRunner = () => {
    if (!selectedEnvId) return;
    setEnvSelectOpen(false);
    setStartTime(new Date());
    setRunnerOpen(true);
    if (runningExec && (runningExec.status === 'ATIVO' || runningExec.status === 'PENDING')) {
      updateMutation.mutate({ ...runningExec, status: 'IN_PROGRESS' });
    }
  };

  const handleFinishExecution = async (status: string) => {
    if (runningExec) {
      const endTime = new Date();
      const durationMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
      
      // Update execution status
      await updateMutation.mutateAsync({ ...runningExec, status });
      
      // Create history
      await ExecutionHistoryService.create({
        testExecutionId: runningExec.id,
        testCaseId: runningTestCase?.id || runningExec.testCaseId,
        environmentId: selectedEnvId,
        startTime: startTime?.toISOString(),
        endTime: endTime.toISOString(),
        durationMs,
        totalSteps: 1, // simplified
        passedSteps: status === 'PASSED' ? 1 : 0,
        failedSteps: status === 'FAILED' ? 1 : 0,
        blockedSteps: status === 'BLOCKED' ? 1 : 0,
        status
      });

      setRunnerOpen(false);
      setRunningExec(null);
      setRunningTestCase(null);
      setStartTime(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Central de Execução de Testes</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} startIcon={<PlayArrowIcon />}>
          Nova Execução
        </Button>
      </Box>

      {isLoading ? <Typography>Carregando execuções...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome / Lista</TableCell>
                <TableCell>Sprint</TableCell>
                <TableCell>Caso de Teste</TableCell>
                <TableCell>Ambiente</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executions?.map((exec) => {
                const tc = testCases?.find((t: TestCase) => t.id === exec.testCaseId);
                return (
                  <TableRow key={exec.id}>
                    <TableCell>{exec.name || `Lote ${exec.id?.substring(0, 4)}`}</TableCell>
                    <TableCell>{exec.sprint || '-'}</TableCell>
                    <TableCell>{tc?.title || exec.testCaseId}</TableCell>
                    <TableCell>{exec.environment}</TableCell>
                    <TableCell>
                      <Chip label={exec.status} color={getStatusColor(exec.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton color="success" onClick={() => handleOpenEnvSelect(exec, tc)} title="Executar Teste">
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => openEdit(exec)} title="Editar Lote">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteMutation.mutate(exec.id!)} title="Excluir">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Criação (Multi-Select) */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Iniciar Nova Execução</DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" label="Nome da Lista / Execução (Opcional)" fullWidth 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField 
              margin="dense" label="Sprint (Ex: Sprint 24)" fullWidth 
              value={formData.sprint} onChange={e => setFormData({...formData, sprint: e.target.value})} 
            />
          </Box>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Casos de Teste (Múltiplos)</InputLabel>
            <Select
              multiple
              value={formData.testCaseIds}
              label="Casos de Teste (Múltiplos)"
              onChange={e => {
                const value = e.target.value;
                setFormData({...formData, testCaseIds: typeof value === 'string' ? value.split(',') : value});
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tc = testCases?.find((t: TestCase) => t.id === value);
                    return <Chip key={value} label={tc?.title || value} />;
                  })}
                </Box>
              )}
            >
              {testCases?.map((tc: TestCase) => (
                <MenuItem key={tc.id} value={tc.id}>{tc.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Ambiente Base (Opcional)</InputLabel>
            <Select
              value={formData.environment}
              label="Ambiente Base (Opcional)"
              onChange={e => setFormData({...formData, environment: e.target.value as string})}
            >
              <MenuItem value="">Nenhum (selecionar na execução)</MenuItem>
              {environments?.map(env => (
                <MenuItem key={env.id} value={env.id}>{env.name} ({env.type})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">Iniciar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição (CRUD) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Execução</DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" label="Nome da Lista / Execução" fullWidth 
            value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} 
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField 
              margin="dense" label="Sprint" fullWidth 
              value={editData.sprint || ''} onChange={e => setEditData({...editData, sprint: e.target.value})} 
            />
          </Box>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Incluir MAIS Casos de Teste neste Lote</InputLabel>
            <Select
              multiple
              value={editData.additionalTestCaseIds || []}
              label="Incluir MAIS Casos de Teste neste Lote"
              onChange={e => {
                const value = e.target.value;
                setEditData({...editData, additionalTestCaseIds: typeof value === 'string' ? value.split(',') : value});
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tc = testCases?.find((t: TestCase) => t.id === value);
                    return <Chip key={value} label={tc?.title || value} />;
                  })}
                </Box>
              )}
            >
              {testCases?.filter((tc: TestCase) => tc.id !== editData.testCaseId).map((tc: TestCase) => (
                <MenuItem key={tc.id} value={tc.id}>{tc.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editData.status || 'ATIVO'}
              label="Status"
              onChange={e => setEditData({...editData, status: e.target.value as string})}
            >
              <MenuItem value="ATIVO">ATIVO</MenuItem>
              <MenuItem value="TESTANDO">TESTANDO</MenuItem>
              <MenuItem value="CONCLUIDO">CONCLUÍDO</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Ambiente</InputLabel>
            <Select
              value={editData.environment || 'QA'}
              label="Ambiente"
              onChange={e => setEditData({...editData, environment: e.target.value as string})}
            >
              <MenuItem value="DEV">DEV</MenuItem>
              <MenuItem value="QA">QA</MenuItem>
              <MenuItem value="STG">Staging</MenuItem>
              <MenuItem value="PROD">Produção</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Select Environment Modal */}
      <Dialog open={envSelectOpen} onClose={() => setEnvSelectOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Selecionar Ambiente</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selecione o ambiente onde o teste "{runningTestCase?.title}" será executado.
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Ambiente</InputLabel>
            <Select
              value={selectedEnvId}
              label="Ambiente"
              onChange={e => setSelectedEnvId(e.target.value)}
            >
              {environments?.map(env => (
                <MenuItem key={env.id} value={env.id!}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: env.color || '#ccc' }} />
                    {env.name} ({env.type})
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnvSelectOpen(false)}>Cancelar</Button>
          <Button onClick={handleStartRunner} variant="contained" disabled={!selectedEnvId}>Iniciar Execução</Button>
        </DialogActions>
      </Dialog>

      {/* Tela de Execução (Runner) */}
      <Dialog open={runnerOpen} onClose={() => setRunnerOpen(false)} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { height: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(30, 41, 59, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Runner de Execução</Typography>
          {runningExec && <Chip label={`Ambiente: ${environments?.find(e => e.id === selectedEnvId)?.name || selectedEnvId}`} color="primary" size="small" />}
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#0f172a' }}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="#94a3b8" sx={{ mb: 1 }}>Caso de Teste</Typography>
              <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 'medium' }}>{runningTestCase?.title || 'Desconhecido'}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`Categoria: ${runningTestCase?.category || '-'}`} variant="outlined" sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)' }} />
              <Chip label={`Funcionalidade: ${runningTestCase?.functionality || '-'}`} variant="outlined" sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)' }} />
              <Chip label={`Prioridade: ${runningTestCase?.priority || '-'}`} variant="outlined" sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)' }} />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            {runningTestCase?.preConditions && (
              <Box>
                <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 1 }}>Pré-condições</Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.5)', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                  {runningTestCase.preConditions}
                </Paper>
              </Box>
            )}

            <Box>
              <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 1 }}>Instruções / Descrição</Typography>
              {runningTestCase?.description ? (
                <Paper sx={{ p: 2, bgcolor: 'rgba(30, 41, 59, 0.5)', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
                  {runningTestCase.description}
                </Paper>
              ) : (
                <Typography color="text.secondary">Nenhuma instrução em texto fornecida.</Typography>
              )}
            </Box>

            {runningTestCase?.gherkinContent && (
              <Box>
                <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 1 }}>Cenário BDD (Gherkin)</Typography>
                <Paper sx={{ p: 2, bgcolor: '#1e1e1e', color: '#a6e22e', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {runningTestCase.gherkinContent}
                </Paper>
              </Box>
            )}
            
            <Box>
              <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 1 }}>Resultado Esperado</Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', whiteSpace: 'pre-wrap', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                {runningTestCase?.expectedResult || 'O sistema deve comportar-se conforme descrito.'}
              </Paper>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={() => setRunnerOpen(false)}>Cancelar / Fechar</Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<BlockIcon />}
              onClick={() => handleFinishExecution('BLOCKED')}
            >
              Bloqueado
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<CancelIcon />}
              onClick={() => handleFinishExecution('FAILED')}
            >
              Falhou
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<CheckCircleIcon />}
              onClick={() => handleFinishExecution('PASSED')}
            >
              Passou
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
