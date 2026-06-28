import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField 
} from '@mui/material';
import { ClientService } from '../services/api';
import type { Client } from '../services/api';

export default function Clients() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Client>({
    name: '', corporateName: '', cnpj: '', contactName: '', contactEmail: '', status: 'ACTIVE'
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientService.getAll
  });

  const mutation = useMutation({
    mutationFn: ClientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setOpen(false);
    }
  });

  const handleSubmit = () => mutation.mutate(formData);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Gestão de Clientes</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Novo Cliente</Button>
      </Box>

      {isLoading ? <Typography>Carregando...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Razão Social</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.corporateName}</TableCell>
                  <TableCell>{client.cnpj}</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>{client.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <TextField margin="dense" label="Razão Social" fullWidth value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} />
          <TextField margin="dense" label="CNPJ" fullWidth value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
          <TextField margin="dense" label="Nome do Contato" fullWidth value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
          <TextField margin="dense" label="E-mail" fullWidth value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
