import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Select, MenuItem, FormControl, InputLabel,
  Checkbox, FormControlLabel, Chip
} from '@mui/material';
import { FileText, Download, Filter, FileSpreadsheet, FileBarChart, Settings } from 'lucide-react';

const availableReports = [
  { id: 'exec', title: 'Relatório Executivo', desc: 'Visão de alto nível para gerentes e stakeholders.', icon: <FileBarChart size={24} color="#6366f1" />, type: 'PDF' },
  { id: 'bugs', title: 'Matriz de Defeitos', desc: 'Listagem detalhada de bugs abertos vs resolvidos.', icon: <FileSpreadsheet size={24} color="#10b981" />, type: 'XLSX' },
  { id: 'trace', title: 'Matriz de Rastreabilidade', desc: 'Requisitos x Testes x Defeitos associados.', icon: <FileText size={24} color="#f59e0b" />, type: 'CSV' },
  { id: 'sprint', title: 'Fechamento de Sprint', desc: 'Resumo da qualidade ao final da iteração.', icon: <FileText size={24} color="#ec4899" />, type: 'PDF' },
];

export const Relatorios = () => {
  const [reportType, setReportType] = useState('exec');
  const [project, setProject] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', color: '#e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileText size={32} color="#6366f1" />
            Relatórios Gerais
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Gere extrações, métricas consolidadas e relatórios customizados da plataforma.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Settings size={18} />} sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#475569' } }}>
          Agendar Envios
        </Button>
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Painel Esquerdo: Configuração do Relatório */}
        <div className="md:col-span-4">
          <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Filter size={20} /> Filtros de Geração
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: '#94a3b8' }}>Tipo de Relatório</InputLabel>
                  <Select
                    value={reportType}
                    label="Tipo de Relatório"
                    onChange={(e) => setReportType(e.target.value)}
                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
                  >
                    {availableReports.map(r => (
                      <MenuItem key={r.id} value={r.id}>{r.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: '#94a3b8' }}>Projeto</InputLabel>
                  <Select
                    value={project}
                    label="Projeto"
                    onChange={(e) => setProject(e.target.value)}
                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
                  >
                    <MenuItem value="all">Todos os Projetos</MenuItem>
                    <MenuItem value="p1">Plataforma SuzanoIT</MenuItem>
                    <MenuItem value="p2">App Mobile</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: '#94a3b8' }}>Período</InputLabel>
                  <Select
                    value={dateRange}
                    label="Período"
                    onChange={(e) => setDateRange(e.target.value)}
                    sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)' }}
                  >
                    <MenuItem value="7d">Últimos 7 dias</MenuItem>
                    <MenuItem value="30d">Últimos 30 dias</MenuItem>
                    <MenuItem value="90d">Últimos 3 meses</MenuItem>
                    <MenuItem value="custom">Período Customizado</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>Opções Avançadas</Typography>
                  <FormControlLabel control={<Checkbox size="small" sx={{ color: '#6366f1' }} defaultChecked />} label={<Typography variant="body2">Incluir gráficos</Typography>} />
                  <FormControlLabel control={<Checkbox size="small" sx={{ color: '#6366f1' }} defaultChecked />} label={<Typography variant="body2">Destacar métricas críticas</Typography>} />
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  startIcon={<Download />}
                  sx={{ mt: 2, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
                >
                  Gerar e Baixar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Painel Direito: Catálogo de Relatórios */}
        <div className="md:col-span-8">
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Catálogo de Modelos Disponíveis</Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableReports.map(report => (
              <div key={report.id}>
                <Card 
                  onClick={() => setReportType(report.id)}
                  sx={{ 
                    bgcolor: reportType === report.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.4)', 
                    border: `1px solid ${reportType === report.id ? '#6366f1' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: 3, 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        {report.icon}
                      </Box>
                      <Chip 
                        label={report.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: report.type === 'PDF' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', 
                          color: report.type === 'PDF' ? '#f87171' : '#34d399',
                          fontWeight: 'bold', fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>{report.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{report.desc}</Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
};
