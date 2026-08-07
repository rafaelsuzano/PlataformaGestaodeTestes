import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import Editor from '@monaco-editor/react';

export default function ResponseViewer() {
  const [tab, setTab] = useState(0);

  // MOCK: Para visualização até integrarmos a chamada real
  const mockResponse = {
    status: 200,
    timeMs: 345,
    size: '1.2 KB',
    body: JSON.stringify({ id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }, null, 2),
    headers: [
      { key: 'content-type', value: 'application/json; charset=utf-8' },
      { key: 'x-powered-by', value: 'Express' }
    ],
    assertions: [
      { name: 'Status is 200', passed: true },
      { name: 'Body contains id', passed: true }
    ]
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return '#4caf50';
    if (status >= 300 && status < 400) return '#2196f3';
    if (status >= 400 && status < 500) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      {/* Response Header Info */}
      <Box sx={{ p: 1, display: 'flex', gap: 3, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.1)' }}>
        <Typography variant="body2" color="text.secondary">Response</Typography>
        <Typography variant="body2" sx={{ color: getStatusColor(mockResponse.status), fontWeight: 'bold' }}>
          Status: {mockResponse.status} OK
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Time: {mockResponse.timeMs} ms
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {mockResponse.size}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Body" sx={{ minHeight: 36, py: 0, fontSize: '0.8rem' }} />
        <Tab label="Headers" sx={{ minHeight: 36, py: 0, fontSize: '0.8rem' }} />
        <Tab label="Test Results" sx={{ minHeight: 36, py: 0, fontSize: '0.8rem' }} />
      </Tabs>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {tab === 0 && (
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={mockResponse.body}
            options={{ minimap: { enabled: false }, readOnly: true, fontSize: 13 }}
          />
        )}
        
        {tab === 1 && (
          <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
            {mockResponse.headers.map((h, i) => (
              <Box key={i} sx={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1 }}>
                <Typography variant="body2" sx={{ width: 200, fontWeight: 'bold' }}>{h.key}</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{h.value}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
            {mockResponse.assertions.map((a, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: a.passed ? '#4caf50' : '#f44336' }} />
                <Typography variant="body2">{a.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
