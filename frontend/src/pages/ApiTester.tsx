import { useState } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, FormControl, Select, MenuItem, Grid,
  CircularProgress, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ApiTesterService, ApiTestPlanService } from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [tab, setTab] = useState(0); // 0 = Params, 1 = Headers, 2 = Body
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [requestName, setRequestName] = useState('');
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [importing, setImporting] = useState(false);

  const queryClient = useQueryClient();
  const { data: plans } = useQuery({ queryKey: ['apiTestPlans'], queryFn: ApiTestPlanService.getAll });

  const handleExecute = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);
    try {
      const headerObj = headers.reduce((acc, h) => {
        if (h.key) acc[h.key] = h.value;
        return acc;
      }, {} as Record<string, string>);

      const result = await ApiTesterService.execute({
        url,
        method,
        headers: headerObj,
        body: tab === 2 && body ? body : null
      });
      setResponse(result);
    } catch (err: any) {
      setResponse({ status: 0, body: 'Erro na conexão com o proxy local.', timeMs: 0 });
    }
    setLoading(false);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return '#4caf50';
    if (status >= 300 && status < 400) return '#2196f3';
    if (status >= 400 && status < 500) return '#ff9800';
    if (status >= 500) return '#f44336';
    return '#9e9e9e';
  };

  const handleSaveToPlan = async () => {
    if (!selectedPlanId || !requestName || !url) return;
    try {
      const headerObj = headers.reduce((acc, h) => { if (h.key) acc[h.key] = h.value; return acc; }, {} as Record<string, string>);
      await ApiTestPlanService.addRequest(selectedPlanId, {
        planId: selectedPlanId,
        name: requestName,
        method,
        url,
        headers: JSON.stringify(headerObj),
        body: tab === 2 && body ? body : undefined,
        expectedStatus
      });
      setSaveDialogOpen(false);
      setRequestName('');
      alert("Requisição salva com sucesso no plano!");
    } catch(err) {
      alert("Erro ao salvar.");
    }
  };

  const handleImportPostman = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setImporting(true);
        const data = JSON.parse(e.target?.result as string);
        if (!data.info || !data.item) throw new Error("Formato inválido. Esperado Postman Collection v2.1");

        // Criar o plano de teste
        const plan = await ApiTestPlanService.create({
          name: data.info.name || "Postman Import",
          description: "Importado via Coleção do Postman"
        });

        // Achatar requests (remover folders)
        const flattenItems = (items: any[]): any[] => {
          let reqs: any[] = [];
          for (const item of items) {
            if (item.item) reqs = reqs.concat(flattenItems(item.item));
            else if (item.request) reqs.push(item);
          }
          return reqs;
        };

        const requests = flattenItems(data.item);

        for (const req of requests) {
          const r = req.request;
          const headersObj = r.header?.reduce((acc: any, h: any) => { acc[h.key] = h.value; return acc; }, {}) || {};
          let url = typeof r.url === 'string' ? r.url : (r.url?.raw || "");
          
          await ApiTestPlanService.addRequest(plan.id!, {
            planId: plan.id!,
            name: req.name || "Request",
            method: r.method || "GET",
            url: url,
            headers: JSON.stringify(headersObj),
            body: r.body?.raw || undefined,
            expectedStatus: 200 // Default Postman imports to 200 OK
          });
        }
        queryClient.invalidateQueries({ queryKey: ['apiTestPlans'] });
        alert(`Coleção importada com sucesso! ${requests.length} requisições adicionadas.`);
      } catch (err: any) {
        alert("Erro ao importar coleção: " + err.message);
      } finally {
        setImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Testador de API</Typography>
        <Button 
          variant="outlined" 
          color="info" 
          startIcon={importing ? <CircularProgress size={20} /> : <FileUploadIcon />}
          component="label"
          disabled={importing}
        >
          Importar Postman
          <input type="file" hidden accept=".json" onChange={handleImportPostman} />
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ width: 120 }}>
          <Select value={method} onChange={e => setMethod(e.target.value as string)} size="small">
            {METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField 
          fullWidth size="small" 
          placeholder="https://api.exemplo.com/v1/users" 
          value={url} onChange={e => setUrl(e.target.value)} 
          sx={{ fontFamily: 'monospace' }}
        />
        <Button 
          variant="contained" color="primary" 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
          onClick={handleExecute}
          disabled={loading || !url}
        >
          Enviar
        </Button>
        <Button 
          variant="outlined" color="secondary" 
          startIcon={<SaveIcon />}
          onClick={() => setSaveDialogOpen(true)}
          disabled={!url}
        >
          Salvar
        </Button>
      </Paper>

      <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Parâmetros" />
              <Tab label={`Headers (${headers.length})`} />
              <Tab label="Body (JSON)" />
            </Tabs>
            <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
              {tab === 0 && <Typography color="text.secondary">Adicione query params na URL (Em breve tabela interativa).</Typography>}
              {tab === 1 && (
                <Box>
                  {headers.map((h, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField size="small" placeholder="Key" value={h.key} onChange={e => {
                        const newH = [...headers]; newH[i].key = e.target.value; setHeaders(newH);
                      }} />
                      <TextField size="small" fullWidth placeholder="Value" value={h.value} onChange={e => {
                        const newH = [...headers]; newH[i].value = e.target.value; setHeaders(newH);
                      }} />
                    </Box>
                  ))}
                  <Button size="small" onClick={() => setHeaders([...headers, { key: '', value: '' }])}>+ Adicionar Header</Button>
                </Box>
              )}
              {tab === 2 && (
                <TextField 
                  multiline fullWidth minRows={10} maxRows={20}
                  placeholder='{&#10;  "chave": "valor"&#10;}'
                  value={body} onChange={e => setBody(e.target.value)}
                  sx={{ fontFamily: 'monospace', '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.9rem' } }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: '#1e1e1e' }}>
            <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">RESPOSTA</Typography>
              {response && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: getStatusColor(response.status), fontWeight: 'bold' }}>
                    Status: {response.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo: {response.timeMs} ms
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a6e22e', whiteSpace: 'pre-wrap' }}>
              {loading ? (
                <Typography color="text.secondary">Aguardando resposta...</Typography>
              ) : response ? (
                (() => {
                  try {
                    return JSON.stringify(JSON.parse(response.body), null, 2);
                  } catch {
                    return response.body || 'Sem corpo de resposta.';
                  }
                })()
              ) : (
                <Typography color="text.secondary">Nenhuma requisição enviada.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Salvar no Plano de Teste</DialogTitle>
        <DialogContent>
          <TextField 
            margin="dense" label="Nome da Requisição (Cenário)" fullWidth 
            value={requestName} onChange={e => setRequestName(e.target.value)} 
          />
          <FormControl fullWidth margin="dense">
            <Select displayEmpty value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value as string)}>
              <MenuItem value="" disabled>Selecione um Plano de Teste</MenuItem>
              {plans?.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField 
            margin="dense" label="Status Code Esperado" type="number" fullWidth 
            value={expectedStatus} onChange={e => setExpectedStatus(Number(e.target.value))} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSaveToPlan} disabled={!selectedPlanId || !requestName}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
