import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, CircularProgress, Chip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EnvironmentService } from '../services/api';
import type { Environment } from '../services/api';

const DEFAULT_FORM_DATA: Environment = {
  name: '',
  description: '',
  baseUrl: '',
  type: 'QA',
  status: 'Ativo',
  color: '#818cf8',
  icon: 'dns'
};

export default function Ambientes() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Environment>(DEFAULT_FORM_DATA);
  const [isEditing, setIsEditing] = useState(false);

  const { data: environments, isLoading } = useQuery({ queryKey: ['environments'], queryFn: EnvironmentService.getAll });

  const createMutation = useMutation({
    mutationFn: EnvironmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      setOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: EnvironmentService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
      setOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: EnvironmentService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments'] })
  });

  const handleSubmit = () => {
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (env: Environment) => {
    setFormData(env);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) deleteMutation.mutate(id);
  };

  const handleOpenNew = () => {
    setFormData(DEFAULT_FORM_DATA);
    setIsEditing(false);
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Cadastro de Ambientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNew}
          sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
        >
          Novo Ambiente
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cor</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>URL Base</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {environments?.map((env) => (
                <TableRow key={env.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: env.color || '#ccc' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#e2e8f0' }}>{env.name}</TableCell>
                  <TableCell>{env.baseUrl || '-'}</TableCell>
                  <TableCell><Chip label={env.type} size="small" /></TableCell>
                  <TableCell>
                    <Chip 
                      label={env.status} 
                      size="small" 
                      color={env.status === 'Ativo' ? 'success' : 'default'}
                      sx={{ bgcolor: env.status === 'Ativo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.1)' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(env)} sx={{ color: '#818cf8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(env.id!)} sx={{ color: '#f87171' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' } }}
      >
        <DialogTitle>{isEditing ? 'Editar Ambiente' : 'Novo Ambiente'}</DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome do Ambiente"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              label="URL Base (Ex: https://qa.api.com)"
              fullWidth
              value={formData.baseUrl || ''}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  label="Tipo"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="DEV">DEV (Desenvolvimento)</MenuItem>
                  <MenuItem value="QA">QA (Qualidade)</MenuItem>
                  <MenuItem value="HML">HML (Homologação)</MenuItem>
                  <MenuItem value="STAGE">STAGE (Staging)</MenuItem>
                  <MenuItem value="UAT">UAT (User Acceptance Testing)</MenuItem>
                  <MenuItem value="PRODUÇÃO">PRODUÇÃO</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Cor de Identificação (Hex)"
              fullWidth
              type="color"
              value={formData.color || '#818cf8'}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#9ca3af' }}>Cancelar</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={createMutation.isPending || updateMutation.isPending || !formData.name}
            sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}
          >
            {isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
