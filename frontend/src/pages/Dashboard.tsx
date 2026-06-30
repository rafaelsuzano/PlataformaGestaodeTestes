import { Box, Typography, Grid, Paper, Card, CardContent, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ProjectService, TestCaseService, TestExecutionService, DefectService, ApiTestPlanService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import BugReportIcon from '@mui/icons-material/BugReport';
import HttpIcon from '@mui/icons-material/Http';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
  <Card sx={{ 
    background: 'rgba(15, 23, 42, 0.6)', 
    backdropFilter: 'blur(16px)', 
    border: '1px solid rgba(255, 255, 255, 0.05)', 
    borderBottom: `4px solid ${color}`,
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      background: 'rgba(30, 41, 59, 0.7)',
    }
  }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
      <Box>
        <Typography sx={{ color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5, mb: 1, textTransform: 'uppercase' }} variant="subtitle2">
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ 
        color: color, 
        bgcolor: `${color}15`, 
        p: 2, 
        borderRadius: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: projects, isLoading: loadP } = useQuery({ queryKey: ['projects'], queryFn: ProjectService.getAll });
  const { data: testCases, isLoading: loadT } = useQuery({ queryKey: ['testCases'], queryFn: TestCaseService.getAll });
  const { data: executions, isLoading: loadE } = useQuery({ queryKey: ['executions'], queryFn: TestExecutionService.getAll });
  const { data: defects, isLoading: loadD } = useQuery({ queryKey: ['defects'], queryFn: DefectService.getAll });
  const { data: apiExecutions, isLoading: loadA } = useQuery({ queryKey: ['apiExecutions'], queryFn: ApiTestPlanService.getRecentExecutions });

  const isLoading = loadP || loadT || loadE || loadD || loadA;

  if (isLoading) {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="h4" sx={{ mb: 4 }}><Skeleton width={250} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /></Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map(i => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.4)' }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <Skeleton variant="text" width="40%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: 400, bgcolor: 'rgba(15, 23, 42, 0.4)', borderRadius: 3 }}>
              <Skeleton variant="text" width="40%" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="rectangular" sx={{ flexGrow: 1, borderRadius: 2, height: 300, bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: 400, bgcolor: 'rgba(15, 23, 42, 0.4)', borderRadius: 3 }}>
              <Skeleton variant="text" width="60%" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Skeleton variant="circular" width={250} height={250} sx={{ m: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Calculate Metrics
  const totalProjects = projects?.length || 0;
  const totalTestCases = testCases?.length || 0;
  const activeDefects = defects?.filter(d => d.status !== 'CLOSED').length || 0;
  const totalApiExecutions = apiExecutions?.length || 0;

  // Executions Status Distribution
  const executionStatusCounts: Record<string, number> = {};
  executions?.forEach(ex => {
    const status = ex.status || 'UNKNOWN';
    executionStatusCounts[status] = (executionStatusCounts[status] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(executionStatusCounts),
    datasets: [
      {
        data: Object.values(executionStatusCounts),
        backgroundColor: [
          '#66bb6a',
          '#29b6f6',
          '#ffa726',
          '#ef5350',
          '#ab47bc',
        ],
        borderColor: '#1e1e1e',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#bbb' } },
    },
  };

  // Defects Severity Distribution
  const defectSeverityCounts: Record<string, number> = { 'Alta': 0, 'Média': 0, 'Baixa': 0 };
  defects?.forEach(d => {
    const sev = d.severity || 'Média';
    defectSeverityCounts[sev] = (defectSeverityCounts[sev] || 0) + 1;
  });

  const barData = {
    labels: ['Alta', 'Média', 'Baixa'],
    datasets: [
      {
        label: 'Defeitos',
        data: [defectSeverityCounts['Alta'], defectSeverityCounts['Média'], defectSeverityCounts['Baixa']],
        backgroundColor: ['#ef5350', '#ffa726', '#66bb6a'],
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { ticks: { color: '#bbb' }, grid: { color: '#333' } },
      x: { ticks: { color: '#bbb' }, grid: { display: false } }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          Dashboard de Qualidade
        </Typography>
      </Box>
      
      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Projetos Ativos" value={totalProjects} icon={<AssignmentIcon sx={{ fontSize: 40 }} />} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Casos de Teste" value={totalTestCases} icon={<ScienceIcon sx={{ fontSize: 40 }} />} color="#10B981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Defeitos Ativos" value={activeDefects} icon={<BugReportIcon sx={{ fontSize: 40 }} />} color="#EF4444" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Testes de API" value={totalApiExecutions} icon={<HttpIcon sx={{ fontSize: 40 }} />} color="#EC4899" />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ 
            p: 3, 
            height: '400px', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#e2e8f0' }}>Status das Execuções (Lotes)</Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ 
            p: 3, 
            height: '400px', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#e2e8f0' }}>Defeitos por Severidade</Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
