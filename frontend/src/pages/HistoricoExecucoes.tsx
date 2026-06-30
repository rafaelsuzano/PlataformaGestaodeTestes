import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Chip,
  TablePagination, TextField
} from '@mui/material';
import { ExecutionHistoryService, EnvironmentService, TestCaseService } from '../services/api';

export default function HistoricoExecucoes() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: history, isLoading: isHistoryLoading } = useQuery({ queryKey: ['executionHistory'], queryFn: ExecutionHistoryService.getAll });
  const { data: environments } = useQuery({ queryKey: ['environments'], queryFn: EnvironmentService.getAll });
  const { data: testCases } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

  const getStatusChip = (status: string) => {
    switch(status) {
      case 'PASSED': return <Chip label="Passou" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)' }} />;
      case 'FAILED': return <Chip label="Falhou" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }} />;
      case 'BLOCKED': return <Chip label="Bloqueado" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.2)' }} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const getEnvironmentName = (id?: string) => environments?.find(e => e.id === id)?.name || id || '-';
  const getTestCaseTitle = (id: string) => testCases?.find(tc => tc.id === id)?.title || id;

  const filteredHistory = history?.filter(h => {
    const tcTitle = getTestCaseTitle(h.testCaseId).toLowerCase();
    const envName = getEnvironmentName(h.environmentId).toLowerCase();
    const search = searchTerm.toLowerCase();
    return tcTitle.includes(search) || envName.includes(search) || h.status.toLowerCase().includes(search);
  }) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Histórico de Execuções</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3, background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Pesquisar histórico por caso de teste, ambiente ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)' }}>
        {(isHistoryLoading) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data de Início</TableCell>
                  <TableCell>Caso de Teste</TableCell>
                  <TableCell>Ambiente</TableCell>
                  <TableCell>Passos (Total/OK/NOK/BLK)</TableCell>
                  <TableCell>Tempo</TableCell>
                  <TableCell>Status Final</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((h) => (
                  <TableRow key={h.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                      {h.startTime ? new Date(h.startTime).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 500 }}>{getTestCaseTitle(h.testCaseId)}</TableCell>
                    <TableCell>{getEnvironmentName(h.environmentId)}</TableCell>
                    <TableCell>
                      {h.totalSteps} / <span style={{ color: '#34d399' }}>{h.passedSteps}</span> / <span style={{ color: '#f87171' }}>{h.failedSteps}</span> / <span style={{ color: '#fbbf24' }}>{h.blockedSteps}</span>
                    </TableCell>
                    <TableCell>{h.durationMs ? `${(h.durationMs / 1000).toFixed(1)}s` : '-'}</TableCell>
                    <TableCell>{getStatusChip(h.status)}</TableCell>
                  </TableRow>
                ))}
                {filteredHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>Nenhum histórico encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredHistory.length}
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
