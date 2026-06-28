import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { RequirementService, ProjectService } from '../services/api';
import type { Requirement } from '../services/api';

export default function Requirements() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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
                <TableCell>Sprint</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requirements?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.code}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{getProjectName(req.projectId)}</TableCell>
                  <TableCell>{req.priority}</TableCell>
                  <TableCell>{req.sprint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
    </Box>
  );
}
