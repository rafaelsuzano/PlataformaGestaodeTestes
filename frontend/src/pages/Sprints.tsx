import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SprintService, ProjectService } from '../services/api';
import type { Sprint, Project } from '../services/api';

export default function Sprints() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Sprint>>({
    name: '', projectId: '', goal: '', status: 'PLANEJADA', startDate: '', endDate: ''
  });

  const { data: sprints, isLoading } = useQuery({ queryKey: ['sprints'], queryFn: SprintService.getAll });
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: ProjectService.getAll });

  const createMutation = useMutation({
    mutationFn: SprintService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      handleClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: SprintService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: SprintService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    }
  });

  const handleOpen = (sprint?: Sprint) => {
    if (sprint) {
      setFormData(sprint);
      setEditMode(true);
    } else {
      setFormData({ name: '', projectId: '', goal: '', status: 'PLANEJADA', startDate: '', endDate: '' });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', projectId: '', goal: '', status: 'PLANEJADA', startDate: '', endDate: '' });
    setEditMode(false);
  };

  const handleSubmit = () => {
    // Format dates to append dummy time if needed to match LocalDateTime backend format
    const formattedData = {
      ...formData,
      startDate: formData.startDate ? `${formData.startDate}T00:00:00` : undefined,
      endDate: formData.endDate ? `${formData.endDate}T23:59:59` : undefined
    };

    if (editMode && formData.id) {
      updateMutation.mutate(formattedData as Sprint);
    } else {
      createMutation.mutate(formattedData as Sprint);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDA': return 'success';
      case 'ATIVA': return 'info';
      case 'PLANEJADA': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestão de Sprints (Ciclos)</Typography>
        <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
          Nova Sprint
        </Button>
      </Box>

      {isLoading ? <Typography>Carregando sprints...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Objetivo</TableCell>
                <TableCell>Início</TableCell>
                <TableCell>Fim</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sprints?.map((sprint) => {
                const proj = projects?.find((p: Project) => p.id === sprint.projectId);
                return (
                  <TableRow key={sprint.id}>
                    <TableCell>{sprint.name}</TableCell>
                    <TableCell>{proj?.name || sprint.projectId}</TableCell>
                    <TableCell>{sprint.goal || '-'}</TableCell>
                    <TableCell>{sprint.startDate?.split('T')[0] || '-'}</TableCell>
                    <TableCell>{sprint.endDate?.split('T')[0] || '-'}</TableCell>
                    <TableCell>
                      <Chip label={sprint.status} color={getStatusColor(sprint.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(sprint)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => deleteMutation.mutate(sprint.id!)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Sprint' : 'Nova Sprint'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
            <InputLabel>Projeto</InputLabel>
            <Select
              value={formData.projectId || ''}
              label="Projeto"
              onChange={e => setFormData({...formData, projectId: e.target.value as string})}
            >
              {projects?.map((proj: Project) => (
                <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField 
            margin="dense" label="Nome (Ex: Sprint 24)" fullWidth 
            value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <TextField 
            margin="dense" label="Objetivo" fullWidth multiline rows={2}
            value={formData.goal || ''} onChange={e => setFormData({...formData, goal: e.target.value})} 
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField 
              margin="dense" label="Data de Início" type="date" fullWidth 
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.startDate?.split('T')[0] || ''} 
              onChange={e => setFormData({...formData, startDate: e.target.value})} 
            />
            <TextField 
              margin="dense" label="Data de Fim" type="date" fullWidth 
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.endDate?.split('T')[0] || ''} 
              onChange={e => setFormData({...formData, endDate: e.target.value})} 
            />
          </Box>

          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status || 'PLANEJADA'}
              label="Status"
              onChange={e => setFormData({...formData, status: e.target.value as string})}
            >
              <MenuItem value="PLANEJADA">PLANEJADA</MenuItem>
              <MenuItem value="ATIVA">ATIVA</MenuItem>
              <MenuItem value="CONCLUIDA">CONCLUÍDA</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
