import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Chip 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { RequirementService, ProjectService, TestCaseService } from '../services/api';
import type { Requirement, TestCase } from '../services/api';

export default function Requirements() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [formData, setFormData] = useState<Requirement>({
    projectId: '', code: '', title: '', description: '', source: '', priority: 'MEDIA', criticality: 'ALTA', sprint: '', releaseVersion: '', status: 'ACTIVE'
  });

  const { data: requirements, isLoading } = useQuery({
    queryKey: ['requirements'],
    queryFn: RequirementService.getAll
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAll
  });

  const { data: testCases } = useQuery({
    queryKey: ['testCases'],
    queryFn: TestCaseService.getAll
  });

  const mutation = useMutation({
    mutationFn: RequirementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      setOpen(false);
    }
  });

  const handleSubmit = () => mutation.mutate(formData);

  const getProjectName = (projectId: string) => {
    return projects?.find(p => p.id === projectId)?.name || projectId;
  };

  const handleView = (req: Requirement) => {
    setSelectedReq(req);
    setViewOpen(true);
  };

  const getLinkedTestCases = (reqId: string) => {
    return testCases?.filter(tc => tc.requirementId === reqId) || [];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestão de Requisitos</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Novo Requisito</Button>
      </Box>

      {isLoading ? <Typography>Carregando...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Cobertura (Testes)</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requirements?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.code}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{getProjectName(req.projectId)}</TableCell>
                  <TableCell>{req.priority}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${getLinkedTestCases(req.id!).length} TC(s)`} 
                      size="small" 
                      color={getLinkedTestCases(req.id!).length > 0 ? "success" : "default"} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleView(req)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal - Novo Requisito */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Requisito</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Projeto</InputLabel>
            <Select
              value={formData.projectId}
              label="Projeto"
              onChange={e => setFormData({...formData, projectId: e.target.value as string})}
            >
              {projects?.map(project => (
                <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField margin="dense" label="Código (ex: REQ-001)" fullWidth value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
          <TextField margin="dense" label="Título" fullWidth value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <TextField margin="dense" label="Sprint" fullWidth value={formData.sprint} onChange={e => setFormData({...formData, sprint: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal - Visualizar Requisito e Rastreabilidade */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Visualizar Requisito: {selectedReq?.code}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedReq?.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Projeto: {getProjectName(selectedReq?.projectId || '')}</Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
            Rastreabilidade (Matriz de Cobertura)
          </Typography>
          
          {selectedReq && getLinkedTestCases(selectedReq.id!).length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Caso de Teste</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getLinkedTestCases(selectedReq.id!).map(tc => (
                  <TableRow key={tc.id}>
                    <TableCell>{tc.title}</TableCell>
                    <TableCell><Chip label={tc.type} size="small" /></TableCell>
                    <TableCell>{tc.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Nenhum Caso de Teste vinculado a este requisito ainda. (Vincule lá na tela de Casos de Teste)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} variant="contained">Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
