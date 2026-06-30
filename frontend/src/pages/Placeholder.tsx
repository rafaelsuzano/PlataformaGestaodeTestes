import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft, Home, Info, Clock, Tag } from 'lucide-react';

export default function Placeholder({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <Box className="w-full h-full flex flex-col items-center justify-center p-4 animate-in fade-in duration-500 min-h-[80vh]">
      <Paper 
        className="max-w-3xl w-full p-8 md:p-12 relative overflow-hidden group text-center flex flex-col items-center"
        sx={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          borderRadius: '24px',
          '&:hover': {
            borderColor: 'rgba(59, 130, 246, 0.4)',
            boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)',
          }
        }}
      >
        {/* Efeitos Decorativos Ciano/Azul */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Badge do Nome da Tela */}
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-8">
            Módulo: {title}
          </div>

          {/* Ícone Animado (Rocket) */}
          <div className="w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-8 shadow-xl shadow-black/20 animate-bounce relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
            <Rocket size={48} className="text-blue-400 relative z-10" />
          </div>
          
          <Typography variant="h3" className="mb-6 text-white font-bold tracking-tight text-3xl md:text-4xl">
            Funcionalidade em Desenvolvimento
          </Typography>
          
          <Typography variant="body1" className="text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed text-lg">
            Esta funcionalidade ainda está em desenvolvimento e estará disponível em uma próxima atualização da Plataforma SuzanoIT QA.
            Nossa equipe está trabalhando para entregar uma experiência completa, moderna e eficiente. Agradecemos sua compreensão.
          </Typography>

          {/* Card de Informações */}
          <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 mb-10 backdrop-blur-sm">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Info size={16} /> Status
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    Em Desenvolvimento
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Clock size={16} /> Disponibilidade
                  </div>
                  <div className="font-semibold text-white">
                    Em breve
                  </div>
                </div>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                    <Tag size={16} /> Versão
                  </div>
                  <div className="font-semibold text-cyan-400">
                    Próxima Atualização
                  </div>
                </div>
              </Grid>
            </Grid>

            {/* Barra de Progresso */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-slate-300">Desenvolvimento em andamento</span>
                <span className="text-blue-400">75%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              startIcon={<ArrowLeft size={18} />}
              sx={{
                color: '#94a3b8',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#94a3b8',
                  background: 'rgba(148, 163, 184, 0.1)'
                }
              }}
              className="flex-1 py-3 rounded-xl font-semibold tracking-wide"
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/')}
              startIcon={<Home size={18} />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
                }
              }}
              className="flex-1 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 font-semibold tracking-wide"
            >
              Ir para Dashboard
            </Button>
          </div>
        </div>
      </Paper>

      {/* Rodapé */}
      <Typography variant="caption" className="text-slate-500 mt-8 font-medium">
        © Suzano IT • Plataforma SuzanoIT QA
      </Typography>
    </Box>
  );
}

