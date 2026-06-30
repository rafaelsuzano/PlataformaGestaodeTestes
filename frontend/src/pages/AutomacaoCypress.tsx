import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AutomatedTestRun, AutomationIntegrationService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export const AutomacaoCypress: React.FC = () => {
  const { user } = useAuth();
  const [runs, setRuns] = useState<AutomatedTestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const projectId = user?.projectIds?.[0] || 'demo-project-id';

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
    // Poll for new results every 15 seconds
    const interval = setInterval(loadRuns, 15000);
    return () => clearInterval(interval);
  }, [projectId]);

  const copySnippet = () => {
    const snippet = `// cypress.config.js
const axios = require('axios');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        const payload = {
          projectId: '${projectId}',
          name: 'Cypress Run - ' + new Date().toISOString(),
          environment: config.env.environment || 'Local',
          framework: 'Cypress',
          tests: results.runs.flatMap(run => 
            run.tests.map(test => ({
              name: test.title[test.title.length - 1],
              suite: test.title[0],
              status: test.state === 'passed' ? 'PASSED' : test.state === 'failed' ? 'FAILED' : 'SKIPPED',
              durationMs: test.duration || 0,
              errorMessage: test.displayError || null
            }))
          )
        };
        await axios.post('https://plataformagestaodetestes-production.up.railway.app/api/integrations/automation/report', payload);
      });
    },
  },
});`;
    navigator.clipboard.writeText(snippet);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automação Cypress</h1>
          <p className="text-muted-foreground mt-2">
            Integração em tempo real com execuções de testes automatizados via Cypress.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-[#0070F0] hover:bg-[#005BCC]">
              <Terminal className="mr-2 h-4 w-4" />
              Configurar Integração
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Integração com Cypress</DialogTitle>
              <DialogDescription className="text-slate-400">
                Adicione o script abaixo no arquivo <code className="text-cyan-400">cypress.config.js</code> do seu projeto para enviar os resultados automaticamente para a nossa plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-4">
              <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm font-mono text-emerald-400">
{`// cypress.config.js
const axios = require('axios');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        const payload = {
          projectId: '${projectId}',
          name: 'Cypress Run - ' + new Date().toISOString(),
          environment: config.env.environment || 'Local',
          framework: 'Cypress',
          tests: results.runs.flatMap(run => 
            run.tests.map(test => ({
              name: test.title[test.title.length - 1],
              suite: test.title[0],
              status: test.state === 'passed' ? 'PASSED' : test.state === 'failed' ? 'FAILED' : 'SKIPPED',
              durationMs: test.duration || 0,
              errorMessage: test.displayError || null
            }))
          )
        };
        // Envia para a Plataforma SuzanoIT QA
        await axios.post('https://plataformagestaodetestes-production.up.railway.app/api/integrations/automation/report', payload);
      });
    },
  },
});`}
              </pre>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-slate-400 hover:text-white" onClick={copySnippet}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Lembre-se de instalar o <code className="text-cyan-400">axios</code> no seu projeto Cypress executando: <br/>
              <code className="text-emerald-400 mt-2 block bg-slate-950 p-2 rounded">npm install axios</code>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Execuções</CardTitle>
            <Terminal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-500">Testes Passados</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runs.reduce((acc, run) => acc + run.passedTests, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Testes Falhos</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runs.reduce((acc, run) => acc + run.failedTests, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-500">Tempo Total Gasto</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(runs.reduce((acc, run) => acc + run.durationMs, 0) / 1000 / 60).toFixed(1)} min
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Execuções</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && runs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Carregando execuções...</div>
          ) : runs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Nenhuma execução recebida ainda. Configure o script no seu projeto Cypress para começar a ver os resultados aqui em tempo real.
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    {run.status === 'PASSED' ? (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <h4 className="font-semibold">{run.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                        <Badge variant="outline">{run.framework}</Badge>
                        <span>•</span>
                        <span>Ambiente: {run.environment || 'Local'}</span>
                        <span>•</span>
                        <span>{new Date(run.executedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-500">Total</span>
                      <span className="font-semibold">{run.totalTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-500">Passed</span>
                      <span className="font-semibold text-emerald-600">{run.passedTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-500">Failed</span>
                      <span className="font-semibold text-red-600">{run.failedTests}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-slate-500">Duração</span>
                      <span className="font-semibold">{(run.durationMs / 1000).toFixed(1)}s</span>
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
