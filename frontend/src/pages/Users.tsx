import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserService, ProjectService } from '../services/api';
import type { User, Project } from '../services/api';

const PROFILES = ['ADMIN', 'QA', 'DEV', 'PO'];

export default function Users() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '', email: '', password: '', profile: 'QA', projectIds: []
  });

  const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['users'], queryFn: UserService.getAll });
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: ProjectService.getAll });

  const createMutation = useMutation({
    mutationFn: UserService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: UserService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleOpen = (user?: User) => {
    if (user) {
      setFormData({ ...user, password: '' }); // Don't show existing password
      setEditMode(true);
    } else {
      setFormData({ name: '', email: '', password: '', profile: 'QA', projectIds: [] });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', email: '', password: '', profile: 'QA', projectIds: [] });
    setEditMode(false);
  };

  const handleSubmit = () => {
    if (editMode && formData.id) {
      updateMutation.mutate(formData as User);
    } else {
      createMutation.mutate(formData as User);
    }
  };

  const handleProjectsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      projectIds: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'ADMIN': return 'error';
      case 'QA': return 'success';
      case 'DEV': return 'info';
      case 'PO': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestão de Usuários e Acessos</Typography>
        <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
          Novo Usuário
        </Button>
      </Box>

      {loadingUsers ? <Typography>Carregando usuários...</Typography> : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Qtd Projetos</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.profile} color={getProfileColor(user.profile) as any} size="small" />
                  </TableCell>
                  <TableCell>{user.projectIds.length} projeto(s)</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(user)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => deleteMutation.mutate(user.id!)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" label="Nome Completo" fullWidth 
            value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <TextField 
            margin="dense" label="E-mail" type="email" fullWidth 
            value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <TextField 
            margin="dense" label={editMode ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'} 
            type="password" fullWidth 
            value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} 
          />
          
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Perfil de Acesso</InputLabel>
            <Select
              value={formData.profile || 'QA'}
              label="Perfil de Acesso"
              onChange={e => setFormData({...formData, profile: e.target.value as string})}
            >
              {PROFILES.map(p => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Projetos Vinculados</InputLabel>
            <Select
              multiple
              value={formData.projectIds || []}
              onChange={handleProjectsChange}
              input={<OutlinedInput label="Projetos Vinculados" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const p = projects?.find((proj: Project) => proj.id === value);
                    return <Chip key={value} label={p?.name || value} size="small" />;
                  })}
                </Box>
              )}
            >
              {projects?.map((proj: Project) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
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
