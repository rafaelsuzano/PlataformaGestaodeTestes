import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, 
  Select, MenuItem, FormControl, InputLabel, Chip,
  LinearProgress, CircularProgress
} from '@mui/material';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { ShieldCheck, Target, AlertTriangle, Layers } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { CoverageService } from '../services/api';
import type { CoverageGlobalDto, CoverageModuleDto, UncoveredRequirementDto } from '../services/api';

export const Cobertura = () => {
  const [project, setProject] = useState('all');

  const { data: globalCoverage, isLoading: isGlobalLoading } = useQuery({
    queryKey: ['coverageGlobal', project],
    queryFn: () => CoverageService.getGlobalCoverage(project)
  });

  const { data: moduleCoverage, isLoading: isModuleLoading } = useQuery({
    queryKey: ['coverageModules', project],
    queryFn: () => CoverageService.getModuleCoverage(project)
  });

  const { data: uncoveredReqs, isLoading: isReqsLoading } = useQuery({
    queryKey: ['coverageReqs', project],
    queryFn: () => CoverageService.getCriticalUncoveredRequirements(project)
  });

  const isLoading = isGlobalLoading || isModuleLoading || isReqsLoading;
  
  // Calculate KPIs based on data
  const totalReqsCovered = globalCoverage?.find((c: CoverageGlobalDto) => c.name === 'Cobertos')?.value ?? 0;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', color: '#e2e8f0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldCheck size={32} color="#10b981" />
            Cobertura de Testes
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Matriz de Rastreabilidade e Análise de Cobertura de Requisitos vs Casos de Teste.
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel sx={{ color: '#94a3b8' }}>Projeto</InputLabel>
          <Select
            value={project}
            label="Projeto"
            onChange={(e) => setProject(e.target.value)}
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.2)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }}
          >
            <MenuItem value="all">Todos os Projetos</MenuItem>
            <MenuItem value="p1">Plataforma SuzanoIT</MenuItem>
            <MenuItem value="p2">App Mobile</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress sx={{ color: '#10b981' }} />
        </Box>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Requisitos Cobertos', value: `${totalReqsCovered}%`, icon: <Target size={24} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.1)' },
              { title: 'Módulos com Teste', value: `${moduleCoverage?.filter((m: CoverageModuleDto) => m.coberto > 0).length || 0}/${moduleCoverage?.length || 0}`, icon: <Layers size={24} color="#3b82f6" />, bg: 'rgba(59, 130, 246, 0.1)' },
              { title: 'Requisitos Críticos Expostos', value: `${uncoveredReqs?.length || 0}`, icon: <AlertTriangle size={24} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.1)' },
            ].map((kpi, idx) => (
              <div key={idx}>
                <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: kpi.bg }}>
                      {kpi.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>{kpi.title}</Typography>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>{kpi.value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-5">
              <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Cobertura Global</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={globalCoverage} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {globalCoverage?.map((entry: CoverageGlobalDto, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                    {globalCoverage?.map((d: CoverageGlobalDto) => (
                      <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: d.color }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{d.name} ({d.value}%)</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-7">
              <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Cobertura por Módulo</Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moduleCoverage} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }} />
                        <Bar dataKey="coberto" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="Cobertura (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Matriz de Requisitos */}
          <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>Requisitos Críticos sem Cobertura</Typography>
                <Button variant="outlined" sx={{ color: '#818cf8', borderColor: 'rgba(129,140,248,0.5)' }}>Ver Matriz Completa</Button>
              </Box>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/50 text-slate-400 text-sm bg-slate-900/30">
                      <th className="p-3 font-semibold">Código</th>
                      <th className="p-3 font-semibold">Título</th>
                      <th className="p-3 font-semibold">Criticidade</th>
                      <th className="p-3 font-semibold">Cobertura</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {uncoveredReqs?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">Nenhum requisito crítico exposto encontrado.</td>
                      </tr>
                    ) : uncoveredReqs?.map((req: UncoveredRequirementDto) => (
                      <tr key={req.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="p-3 font-mono text-indigo-400">{req.id}</td>
                        <td className="p-3 text-white font-medium">{req.title}</td>
                        <td className="p-3">
                          <Chip 
                            label={req.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: req.status.toUpperCase() === 'CRITICAL' || req.status.toUpperCase() === 'CRÍTICA' ? 'rgba(239,68,68,0.2)' : req.status.toUpperCase() === 'HIGH' || req.status.toUpperCase() === 'ALTA' ? 'rgba(245,158,11,0.2)' : 'rgba(52,211,153,0.2)',
                              color: req.status.toUpperCase() === 'CRITICAL' || req.status.toUpperCase() === 'CRÍTICA' ? '#f87171' : req.status.toUpperCase() === 'HIGH' || req.status.toUpperCase() === 'ALTA' ? '#fbbf24' : '#34d399',
                              fontWeight: 'bold'
                            }} 
                          />
                        </td>
                        <td className="p-3">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={req.coverage} 
                                sx={{ 
                                  height: 6, borderRadius: 3, 
                                  bgcolor: 'rgba(255,255,255,0.1)',
                                  '& .MuiLinearProgress-bar': { bgcolor: req.coverage === 100 ? '#10b981' : req.coverage > 40 ? '#f59e0b' : '#ef4444' }
                                }} 
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', minWidth: 35 }}>{req.coverage}%</Typography>
                          </Box>
                        </td>
                        <td className="p-3">
                          {req.coverage === 100 ? (
                            <span className="text-emerald-400 font-semibold text-xs bg-emerald-400/10 px-2 py-1 rounded">Coberto</span>
                          ) : req.coverage > 0 ? (
                            <span className="text-amber-400 font-semibold text-xs bg-amber-400/10 px-2 py-1 rounded">Parcial</span>
                          ) : (
                            <span className="text-red-400 font-semibold text-xs bg-red-400/10 px-2 py-1 rounded">Descoberto</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};
