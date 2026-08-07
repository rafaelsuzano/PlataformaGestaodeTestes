import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, Tabs, Tab, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApiTestingStore } from '../../store/apiTestingStore';
import Editor from '@monaco-editor/react';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export default function RequestBuilder() {
  const { activeRequest, updateActiveRequest } = useApiTestingStore();
  const [tab, setTab] = useState(0);

  // Local state for headers to handle dynamic list
  const [headers, setHeaders] = useState<{key: string, value: string}[]>([]);

  useEffect(() => {
    if (activeRequest?.headers) {
      try {
        setHeaders(JSON.parse(activeRequest.headers));
      } catch (e) {
        setHeaders([{ key: '', value: '' }]);
      }
    } else {
      setHeaders([{ key: '', value: '' }]);
    }
  }, [activeRequest?.id]);

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
    updateActiveRequest({ headers: JSON.stringify(newHeaders) });
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    updateActiveRequest({ headers: JSON.stringify(newHeaders) });
  };

  const [isSending, setIsSending] = useState(false);

  const handleExecute = async () => {
    if (!activeRequest) return;
    setIsSending(true);
    try {
      // Import the service dynamically or standardly at the top
      const { ApiRequestService } = await import('../../services/apiTesting');
      const result = await ApiRequestService.execute(activeRequest, null);
      console.log('Result', result);
      // Aqui jogaríamos o resultado no store para o ResponseViewer ler!
    } catch (e) {
      console.error('Execution failed', e);
    } finally {
      setIsSending(false);
    }
  };

  if (!activeRequest) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
        <Typography variant="h6" color="text.secondary">Selecione uma requisição na Sidebar</Typography>
        <Typography variant="body2" color="text.secondary">ou crie uma nova para começar.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* URL Bar */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Select 
          size="small" 
          value={activeRequest.method} 
          onChange={e => updateActiveRequest({ method: e.target.value as string })}
          sx={{ width: 120, bgcolor: 'rgba(0,0,0,0.2)' }}
        >
          {METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
        <TextField 
          fullWidth size="small" 
          placeholder="{{baseUrl}}/users"
          value={activeRequest.url}
          onChange={e => updateActiveRequest({ url: e.target.value })}
          sx={{ fontFamily: 'monospace' }}
        />
        <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />} onClick={handleExecute} disabled={isSending}>
          {isSending ? 'Sending...' : 'Send'}
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<SaveIcon />}>
          Save
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}>
        <Tab label="Params" sx={{ minHeight: 40, py: 0 }} />
        <Tab label={`Headers (${headers.filter(h => h.key).length})`} sx={{ minHeight: 40, py: 0 }} />
        <Tab label="Auth" sx={{ minHeight: 40, py: 0 }} />
        <Tab label="Body" sx={{ minHeight: 40, py: 0 }} />
        <Tab label="Pre-Request" sx={{ minHeight: 40, py: 0 }} />
        <Tab label="Tests" sx={{ minHeight: 40, py: 0 }} />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tab === 0 && <Typography color="text.secondary">Query Parameters (Tabela Interativa)</Typography>}
        
        {tab === 1 && (
          <Box>
            {headers.map((h, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField size="small" placeholder="Key" value={h.key} onChange={e => handleHeaderChange(i, 'key', e.target.value)} sx={{ width: 250 }} />
                <TextField size="small" fullWidth placeholder="Value" value={h.value} onChange={e => handleHeaderChange(i, 'value', e.target.value)} />
                <IconButton size="small" color="error" onClick={() => removeHeader(i)}><DeleteIcon /></IconButton>
              </Box>
            ))}
            <Button size="small" onClick={addHeader}>+ Add Header</Button>
          </Box>
        )}

        {tab === 3 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 1 }}>
              <Select size="small" value={activeRequest.bodyType || 'JSON'} onChange={e => updateActiveRequest({ bodyType: e.target.value as string })}>
                <MenuItem value="JSON">JSON</MenuItem>
                <MenuItem value="XML">XML</MenuItem>
                <MenuItem value="TEXT">Text</MenuItem>
                <MenuItem value="FORM_DATA">Form Data</MenuItem>
                <MenuItem value="NONE">None</MenuItem>
              </Select>
            </Box>
            {activeRequest.bodyType !== 'NONE' && (
              <Box sx={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
                <Editor
                  height="100%"
                  defaultLanguage={activeRequest.bodyType === 'JSON' ? 'json' : 'text'}
                  theme="vs-dark"
                  value={activeRequest.body || ''}
                  onChange={(val) => updateActiveRequest({ body: val })}
                  options={{ minimap: { enabled: false }, fontSize: 13 }}
                />
              </Box>
            )}
          </Box>
        )}

        {tab === 4 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>JavaScript executado ANTES da requisição.</Typography>
            <Box sx={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={activeRequest.preRequestScript || ''}
                onChange={(val) => updateActiveRequest({ preRequestScript: val })}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            </Box>
          </Box>
        )}

        {tab === 5 && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>JavaScript executado DEPOIS da resposta (Ex: `setVariable('token', response.json.token)`).</Typography>
            <Box sx={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={activeRequest.postResponseScript || ''}
                onChange={(val) => updateActiveRequest({ postResponseScript: val })}
                options={{ minimap: { enabled: false }, fontSize: 13 }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
