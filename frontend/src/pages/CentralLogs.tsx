import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Chip,
  TablePagination, TextField
} from '@mui/material';
import { SystemLogService } from '../services/api';

export default function CentralLogs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs, isLoading } = useQuery({ queryKey: ['systemLogs'], queryFn: SystemLogService.getAll });

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const filteredLogs = logs?.filter(log => 
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Central de Logs</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Pesquisar logs por descrição, módulo ou ação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data / Hora</TableCell>
                  <TableCell>Módulo</TableCell>
                  <TableCell>Ação</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Usuário ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                  <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell><Chip label={log.module} size="small" sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }} /></TableCell>
                    <TableCell><Chip label={log.actionType} size="small" variant="outlined" sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)' }} /></TableCell>
                    <TableCell sx={{ color: '#e2e8f0' }}>{log.description}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.8rem' }}>{log.userId || 'Sistema'}</TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#9ca3af' }}>Nenhum log encontrado para o filtro.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página"
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
}
