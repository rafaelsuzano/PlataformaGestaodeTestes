import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, 
  Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { Activity, TrendingUp, Bug, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MetricsService } from '../services/api';

export const Metricas = () => {
  const [project, setProject] = useState('all');

  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['metricsKpis', project],
    queryFn: () => MetricsService.getKpis(project)
  });

  const { data: trendData, isLoading: isTrendLoading } = useQuery({
    queryKey: ['metricsTrend', project],
    queryFn: () => MetricsService.getTrend(project)
  });

  const { data: densityData, isLoading: isDensityLoading } = useQuery({
    queryKey: ['metricsDensity', project],
    queryFn: () => MetricsService.getDefectDensity(project)
  });

  const isLoading = isKpisLoading || isTrendLoading || isDensityLoading;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', color: '#e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Activity size={32} color="#ec4899" />
            Métricas de Qualidade
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Acompanhe indicadores de desempenho, tendências de execução e densidade de defeitos reais.
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }} size="small">
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
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress sx={{ color: '#ec4899' }} />
        </Box>
      ) : (
        <>
          {/* Mini KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Taxa de Sucesso (Pass Rate)', value: `${kpis?.passRate ?? 0}%`, trend: 'Baseado no DB', up: (kpis?.passRate ?? 0) >= 80, icon: <CheckCircle size={24} color="#10b981" /> },
              { title: 'Defeitos por KLOC (est.)', value: `${kpis?.defectsPerKloc ?? 0}`, trend: `Total: ${kpis?.totalBugs ?? 0} Bugs`, up: (kpis?.defectsPerKloc ?? 0) < 2, icon: <Bug size={24} color="#f59e0b" /> },
              { title: 'Velocidade de Teste', value: `${kpis?.testVelocity ?? 0} Exec/mês`, trend: 'Em tempo real', up: true, icon: <TrendingUp size={24} color="#3b82f6" /> },
            ].map((kpi, idx) => (
              <div key={idx}>
                <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>{kpi.title}</Typography>
                      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>{kpi.value}</Typography>
                      <Typography variant="body2" sx={{ color: kpi.up ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {kpi.trend}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                      {kpi.icon}
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Tendência de Execução (Pass vs Fail)</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                        <Legend />
                        <Area type="monotone" dataKey="pass" stroke="#10b981" fillOpacity={1} fill="url(#colorPass)" name="Passou" />
                        <Area type="monotone" dataKey="fail" stroke="#ef4444" fillOpacity={1} fill="url(#colorFail)" name="Falhou" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Densidade de Defeitos por Módulo</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={densityData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                        <Bar dataKey="density" fill="#ec4899" radius={[4, 4, 0, 0]} name="Bugs / KLOC" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Abertura vs Resolução de Bugs</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                        <Legend />
                        <Line type="monotone" dataKey="bugs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Bugs Encontrados" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};
