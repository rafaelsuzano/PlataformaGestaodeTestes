import React, { useEffect, useState } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Chip } from '@mui/material';
import { Copy, Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { AutomatedTestRun } from '@/services/api';
import { AutomationIntegrationService } from '@/services/api';

export const AutomacaoPlaywright: React.FC = () => {
  // Para MVP, usando um projectId hardcoded ou capturado do localstorage
  const projectId = localStorage.getItem('currentProjectId') || 'default-project-id';
  const [runs, setRuns] = useState<AutomatedTestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const data = await AutomationIntegrationService.getRunsByProject(projectId);
      setRuns(data);
    } catch (error) {
      console.error('Error loading automation runs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
    const interval = setInterval(loadRuns, 15000);
    return () => clearInterval(interval);
  }, [projectId]);

  const copySnippet = () => {
    const snippet = `// playwright-reporter.ts
import { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';
import axios from 'axios';

class SuzanoQA_Reporter implements Reporter {
  private tests: any[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.tests.push({
      name: test.title,
      suite: test.parent.title,
      status: result.status === 'passed' ? 'PASSED' : result.status === 'failed' ? 'FAILED' : 'SKIPPED',
      durationMs: result.duration,
      errorMessage: result.errors.length > 0 ? result.errors[0].message : null
    });
  }

  async onEnd(result: FullResult) {
    const payload = {
      projectId: '${projectId}',
      name: 'Playwright Run - ' + new Date().toISOString(),
      environment: process.env.ENVIRONMENT || 'Local',
      framework: 'Playwright',
      tests: this.tests
    };

    try {
      await axios.post('https://plataformagestaodetestes-production.up.railway.app/api/integrations/automation/report', payload);
      console.log('✅ Resultados enviados para a Plataforma SuzanoIT QA');
    } catch (e: any) {
      console.error('❌ Falha ao enviar resultados:', e.message);
    }
  }
}
export default SuzanoQA_Reporter;

/* === No seu playwright.config.ts adicione ===
  reporter: [
    ['list'],
    ['./playwright-reporter.ts']
  ],
*/`;
    navigator.clipboard.writeText(snippet);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Automação Playwright</h1>
          <p className="text-slate-400 mt-2">
            Integração em tempo real com execuções de testes automatizados via Playwright.
          </p>
        </div>
        
        <Button 
          variant="contained" 
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#0070F0', '&:hover': { bgcolor: '#005BCC' }, borderRadius: 2 }}
        >
          <Terminal className="mr-2 h-4 w-4" />
          Configurar Integração
        </Button>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#0f172a', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 2 }}>
          Guia de Integração com Playwright
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#0f172a', color: '#cbd5e1', pt: 4, overflowX: 'hidden' }}>
          
          <div className="space-y-8 mt-2">
            {/* Passo 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/50 shrink-0">1</div>
                <div className="w-px h-full bg-slate-800 mt-2"></div>
              </div>
              <div className="flex-1 pb-4 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2">Instale a dependência</h3>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  O reporter customizado precisa da biblioteca <code>axios</code> para enviar os dados para a nossa API. Execute o comando abaixo no terminal do seu projeto de testes:
                </Typography>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-emerald-400 border border-slate-800 text-sm overflow-x-auto">
                  npm install axios
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/50 shrink-0">2</div>
                <div className="w-px h-full bg-slate-800 mt-2"></div>
              </div>
              <div className="flex-1 pb-4 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2">Crie o Custom Reporter</h3>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  Na raiz do seu projeto de automação, crie um arquivo chamado <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">suzano-reporter.ts</code> e cole o código abaixo. Ele será responsável por interceptar a finalização dos testes e enviar os resultados.
                </Typography>
                
                <Box sx={{ position: 'relative' }}>
                  <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto overflow-y-auto text-xs font-mono text-emerald-400 border border-slate-800 max-h-[300px] w-full">
{`import { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';
import axios from 'axios';

class SuzanoQA_Reporter implements Reporter {
  private tests: any[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.tests.push({
      name: test.title,
      suite: test.parent.title,
      status: result.status === 'passed' ? 'PASSED' : result.status === 'failed' ? 'FAILED' : 'SKIPPED',
      durationMs: result.duration,
      errorMessage: result.errors.length > 0 ? result.errors[0].message : null
    });
  }

  async onEnd(result: FullResult) {
    const payload = {
      projectId: '${projectId}',
      name: 'Playwright Run - ' + new Date().toISOString(),
      environment: process.env.ENVIRONMENT || 'Local',
      framework: 'Playwright',
      tests: this.tests
    };

    try {
      // O Endpoint da Plataforma
      await axios.post('https://plataformagestaodetestes-production.up.railway.app/api/integrations/automation/report', payload);
      console.log('✅ Resultados enviados com sucesso para a Plataforma SuzanoIT QA');
    } catch (e: any) {
      console.error('❌ Falha ao enviar resultados para a Plataforma QA:', e.message);
    }
  }
}
export default SuzanoQA_Reporter;`}
                  </pre>
                  <Button 
                    sx={{ position: 'absolute', top: 8, right: 8, minWidth: 'auto', p: 1, color: '#94a3b8', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }} 
                    onClick={copySnippet}
                    title="Copiar Código"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </Box>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/50 shrink-0">3</div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2">Ative o Reporter no Playwright</h3>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  Por fim, abra o seu arquivo de configuração <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">playwright.config.ts</code> e registre o nosso novo reporter na lista:
                </Typography>
                <div className="bg-slate-950 p-4 rounded-lg font-mono text-emerald-400 border border-slate-800 text-xs overflow-x-auto">
<pre>{`import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Mantenha as outras configurações intactas...
  reporter: [
    ['list'], // Reporter padrão no terminal
    ['./suzano-reporter.ts'] // Nosso Custom Reporter
  ],
});`}</pre>
                </div>
                <Typography variant="body2" sx={{ color: '#10b981', mt: 3, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle size={18} />
                  Tudo pronto! Na próxima vez que você executar seus testes, os resultados aparecerão neste dashboard.
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)', p: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            variant="outlined"
            sx={{ color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' } }}
          >
            Sair
          </Button>
        </DialogActions>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 2 }}>
          <CardContent>
            <div className="flex items-center justify-between pb-2">
              <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Total de Execuções</Typography>
              <Terminal className="h-4 w-4 text-slate-500" />
            </div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{runs.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 2 }}>
          <CardContent>
            <div className="flex items-center justify-between pb-2">
              <Typography variant="subtitle2" sx={{ color: '#10b981' }}>Testes Passados</Typography>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {runs.reduce((acc, run) => acc + run.passedTests, 0)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 2 }}>
          <CardContent>
            <div className="flex items-center justify-between pb-2">
              <Typography variant="subtitle2" sx={{ color: '#ef4444' }}>Testes Falhos</Typography>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {runs.reduce((acc, run) => acc + run.failedTests, 0)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 2 }}>
          <CardContent>
            <div className="flex items-center justify-between pb-2">
              <Typography variant="subtitle2" sx={{ color: '#3b82f6' }}>Tempo Total Gasto</Typography>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {(runs.reduce((acc, run) => acc + run.durationMs, 0) / 1000 / 60).toFixed(1)} min
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', color: 'white', borderRadius: 2, mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>Últimas Execuções</Typography>
          
          {loading && runs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Carregando execuções...</div>
          ) : runs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Nenhuma execução recebida ainda. Configure o Custom Reporter no seu projeto Playwright para começar a ver os resultados aqui em tempo real.
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    {run.status === 'PASSED' ? (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{run.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                        <Chip label={run.framework} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', height: 20 }} />
                        <span>•</span>
                        <span>Ambiente: {run.environment || 'Local'}</span>
                        <span>•</span>
                        <span>{new Date(run.executedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-500">Total</span>
                      <span className="font-semibold text-white">{run.totalTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-500">Passed</span>
                      <span className="font-semibold text-emerald-400">{run.passedTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-500">Failed</span>
                      <span className="font-semibold text-red-400">{run.failedTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-slate-500">Duração</span>
                      <span className="font-semibold text-white">{(run.durationMs / 1000).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
