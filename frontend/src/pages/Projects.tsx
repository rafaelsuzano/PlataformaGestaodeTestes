import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { ProjectService, UserService } from '../services/api';
import type { Project, User } from '../services/api';
export default function Projects() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Project>({
    name: '', description: '', version: '', status: 'ACTIVE', managerName: ''
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAll
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: UserService.getAll
  });

  const managerCandidates = users?.filter(u => 
    ['ADMIN', 'QA', 'PO'].includes(u.profile?.toUpperCase() || '')
  ) || [];


  const mutation = useMutation({
    mutationFn: ProjectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
    }
  });

  const handleSubmit = () => mutation.mutate(formData);



  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestão de Projetos</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Novo Projeto</Button>
      </Box>

      {isLoading ? <Typography>Carregando...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>

                <TableCell>Versão</TableCell>
                <TableCell>Gerente</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>

                  <TableCell>{project.version}</TableCell>
                  <TableCell>{project.managerName}</TableCell>
                  <TableCell>{project.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Projeto</DialogTitle>
        <DialogContent>

          <TextField margin="dense" label="Nome do Projeto" fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <TextField margin="dense" label="Descrição" fullWidth value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <TextField margin="dense" label="Versão" fullWidth value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Gerente Responsável</InputLabel>
            <Select
              value={formData.managerName || ''}
              label="Gerente Responsável"
              onChange={e => setFormData({...formData, managerName: e.target.value})}
            >
              <MenuItem value="">
                <em>Nenhum</em>
              </MenuItem>
              {managerCandidates.map((user: User) => (
                <MenuItem key={user.id} value={user.name}>
                  {user.name} ({user.profile})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
