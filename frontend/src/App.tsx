import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Requirements from './pages/Requirements';
import CasosTeste from './pages/CasosTeste';
import PlanosTeste from './pages/PlanosTeste';
import HistoricoExecucoes from './pages/HistoricoExecucoes';
import CentralLogs from './pages/CentralLogs';
import Ambientes from './pages/Ambientes';
import Execucao from './pages/Execucao';
import Defeitos from './pages/Defeitos';
import Sprints from './pages/Sprints';
import Users from './pages/Users';
import Integrations from './pages/Integrations';
import ApiTester from './pages/ApiTester';
import CentralExecucaoApi from './pages/CentralExecucaoApi';
import { AutomacaoCypress } from './pages/AutomacaoCypress';
import Layout from './components/Layout';
import Placeholder from './pages/Placeholder';
import { SettingsDashboard } from './pages/SettingsDashboard';


const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo premium
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink vibrant
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0B0F19', // Deep space blue/black
      paper: 'rgba(26, 32, 53, 0.7)', // Translúcido para Glassmorphism
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' },
    h5: { fontWeight: 600, color: '#F1F5F9' },
    h6: { fontWeight: 600, letterSpacing: '0.01em', color: '#E2E8F0' },
    body1: { color: '#CBD5E1' },
    body2: { color: '#94A3B8' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B0F19',
          backgroundImage: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent 80%)',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { 
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            transform: 'translateY(-1px)'
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          color: '#94A3B8',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03) !important',
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(20px)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 15, 25, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            transition: 'all 0.2s',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              borderWidth: '1px',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
            },
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }
    }
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('auth') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem('auth');
  // };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
            />
            {isAuthenticated ? (
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projetos" element={<Projects />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/requisitos" element={<Requirements />} />
                <Route path="/casos-teste" element={<CasosTeste />} />
                <Route path="/planos-teste" element={<PlanosTeste />} />
                <Route path="/historico-execucoes" element={<HistoricoExecucoes />} />
                <Route path="/logs" element={<CentralLogs />} />
                <Route path="/ambientes" element={<Ambientes />} />
                <Route path="/sprints" element={<Sprints />} />
                <Route path="/integracoes" element={<Integrations />} />
                <Route path="/api-tester" element={<ApiTester />} />
                <Route path="/central-api" element={<CentralExecucaoApi />} />
                <Route path="/execucao" element={<Execucao />} />
                <Route path="/defeitos" element={<Defeitos />} />



                {/* --- Placeholders para novas rotas QA Workspace --- */}
                <Route path="/funcionalidades" element={<Placeholder title="Funcionalidades" />} />
                <Route path="/evidencias" element={<Placeholder title="Central de Evidências" />} />
                <Route path="/automacao-cypress" element={<AutomacaoCypress />} />
                <Route path="/automacao-playwright" element={<Placeholder title="Integração Playwright" />} />
                <Route path="/automacao-selenium" element={<Placeholder title="Integração Selenium" />} />
                <Route path="/pipelines" element={<Placeholder title="Pipelines e CI/CD" />} />
                <Route path="/cobertura" element={<Placeholder title="Cobertura de Testes" />} />
                <Route path="/relatorios" element={<Placeholder title="Relatórios Gerais" />} />
                <Route path="/metricas" element={<Placeholder title="Métricas de Qualidade" />} />

                {/* --- Placeholders para novas rotas Admin Settings --- */}
                <Route path="/admin" element={<SettingsDashboard />} />
                <Route path="/times" element={<Placeholder title="Gestão de Times" />} />
                <Route path="/perfis" element={<Placeholder title="Perfis de Acesso" />} />
                <Route path="/permissoes" element={<Placeholder title="Gestão de Permissões" />} />
                <Route path="/banco-de-dados" element={<Placeholder title="Configurações de Banco de Dados" />} />
                <Route path="/backup" element={<Placeholder title="Rotinas de Backup" />} />
                <Route path="/api-keys" element={<Placeholder title="Gerenciamento de API Keys" />} />
                <Route path="/tokens" element={<Placeholder title="Tokens de Acesso" />} />
                <Route path="/auditoria" element={<Placeholder title="Logs de Auditoria Avançados" />} />
                <Route path="/notificacoes" element={<Placeholder title="Configuração de Notificações" />} />
                <Route path="/licenciamento" element={<Placeholder title="Licenciamento e Plano" />} />
                <Route path="/faturamento" element={<Placeholder title="Faturamento e Cobrança" />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
