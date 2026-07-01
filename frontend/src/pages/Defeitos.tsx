import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Chip
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import { DefectService, TestCaseService } from '../services/api';
import type { Defect, TestCase } from '../services/api';

export default function Defeitos() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Defect>({
    testCaseId: '', title: '', description: '', severity: 'MEDIUM', status: 'OPEN'
  });

  const { data: testCases } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });
  const { data: defects, isLoading } = useQuery({ queryKey: ['defects'], queryFn: DefectService.getAll });

  const createMutation = useMutation({
    mutationFn: DefectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
      setOpen(false);
    }
  });

  const handleCreate = () => createMutation.mutate(formData);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Rastreamento de Defeitos (Bugs)</Typography>
        <Button variant="contained" color="error" onClick={() => setOpen(true)} startIcon={<BugReportIcon />}>
          Reportar Defeito
        </Button>
      </Box>

      {isLoading ? <Typography>Carregando defeitos...</Typography> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Caso de Teste</TableCell>
                <TableCell>Severidade</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defects?.map((defect) => {
                const tc = testCases?.find((t: TestCase) => t.id === defect.testCaseId);
                return (
                  <TableRow key={defect.id}>
                    <TableCell>{defect.id?.substring(0, 8)}</TableCell>
                    <TableCell>{defect.title}</TableCell>
                    <TableCell>{tc?.title || defect.testCaseId}</TableCell>
                    <TableCell>
                      <Chip label={defect.severity} color={getSeverityColor(defect.severity) as any} size="small" />
                    </TableCell>
                    <TableCell>{defect.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reportar Novo Defeito</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="Título do Defeito" fullWidth
            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense" label="Descrição (Opcional)" fullWidth multiline rows={3}
            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Caso de Teste Vinculado</InputLabel>
            <Select
              value={formData.testCaseId}
              label="Caso de Teste Vinculado"
              onChange={e => setFormData({ ...formData, testCaseId: e.target.value as string })}
            >
              {testCases?.map((tc: TestCase) => (
                <MenuItem key={tc.id} value={tc.id}>{tc.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel>Severidade</InputLabel>
            <Select
              value={formData.severity}
              label="Severidade"
              onChange={e => setFormData({ ...formData, severity: e.target.value as string })}
            >
              <MenuItem value="CRITICAL">CRÍTICO</MenuItem>
              <MenuItem value="HIGH">ALTA</MenuItem>
              <MenuItem value="MEDIUM">MÉDIA</MenuItem>
              <MenuItem value="LOW">BAIXA</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate} variant="contained" color="error">Reportar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
