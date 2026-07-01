import React, { useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { Play, Copy, CheckCircle, Wand2 } from 'lucide-react';
import { AiService } from '@/services/api';

export const GherkinPlaywright: React.FC = () => {
  const [gherkin, setGherkin] = useState('');
  const [playwrightCode, setPlaywrightCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!gherkin.trim()) return;
    try {
      setLoading(true);
      const data = await AiService.generatePlaywright(gherkin);
      setPlaywrightCode(data.code || '');
      setCopied(false);
    } catch (error) {
      console.error('Error generating playwright code:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(playwrightCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto', color: 'white' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Wand2 className="text-purple-500" size={32} />
            Gerador Playwright via Gherkin
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Cole seu cenário BDD (Gherkin) à esquerda e deixe a IA gerar o código TypeScript final para o Playwright à direita.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!gherkin || loading}
          sx={{
            background: 'linear-gradient(45deg, #a855f7 30%, #3b82f6 90%)',
            px: 4, py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Play size={20} />}
        >
          {loading ? 'Gerando Código...' : 'Gerar Código Playwright'}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, height: 'calc(100vh - 250px)' }}>
        
        {/* Painel Esquerdo: Gherkin Input */}
        <Paper 
          sx={{ 
            bgcolor: '#0f172a', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 2,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography sx={{ fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>feature.feature (Gherkin)</Typography>
          </Box>
          <textarea
            value={gherkin}
            onChange={(e) => setGherkin(e.target.value)}
            placeholder="Funcionalidade: Login no sistema\n\n  Cenário: Login com sucesso\n    Dado que acesso a página de login\n    Quando preencho 'admin' e '12345'\n    E clico em Entrar\n    Então vejo o dashboard"
            className="w-full h-full p-4 bg-transparent text-emerald-400 font-mono text-sm resize-none focus:outline-none"
            style={{ tabSize: 2 }}
            spellCheck={false}
          />
        </Paper>

        {/* Painel Direito: Playwright Output */}
        <Paper 
          sx={{ 
            bgcolor: '#0f172a', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 2,
            display: 'flex', flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', color: '#38bdf8', fontFamily: 'monospace' }}>test.spec.ts (Playwright)</Typography>
            {playwrightCode && (
              <Button 
                size="small" 
                onClick={copyToClipboard}
                sx={{ color: copied ? '#10b981' : '#94a3b8', textTransform: 'none' }}
                startIcon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              >
                {copied ? 'Copiado!' : 'Copiar Código'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ p: 4, overflowY: 'auto', flexGrow: 1, position: 'relative' }}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: 2 }}>
                <CircularProgress size={40} sx={{ color: '#38bdf8' }} />
                <Typography>Analisando Gherkin e gerando assertions do Playwright...</Typography>
              </Box>
            ) : !playwrightCode ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#475569' }}>
                <Typography>O código TypeScript gerado aparecerá aqui.</Typography>
              </Box>
            ) : (
              <pre className="text-cyan-400 font-mono text-sm whitespace-pre-wrap">
                {playwrightCode}
              </pre>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
