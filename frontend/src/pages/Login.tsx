import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Fade,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { UserService } from '../services/api';
import { useBranding } from '../contexts/BrandingContext';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { branding } = useBranding();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      try {
        const user = await UserService.login({ email: username, password }); // Usando o campo username como email
        localStorage.setItem('user', JSON.stringify(user));
        onLogin();
        navigate('/');
      } catch (err: any) {
        setError(err.message || 'Credenciais inválidas.');
      }
    } else {
      // Cadastro
      try {
        if (username && password && email) {
          await UserService.create({
            name: username,
            email: email,
            password: password,
            profile: 'QA', // Default profile for self-registration
            projectIds: []
          });
          setSuccess('Cadastro realizado com sucesso! Faça login.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 2000);
        } else {
          setError('Preencha todos os campos!');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao cadastrar.');
      }
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: branding?.backgroundImage 
            ? `url(${branding.backgroundImage}) no-repeat center center fixed` 
            : 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        backgroundSize: 'cover',
        padding: 3
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 450,
            borderRadius: 4,
            background: 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {branding?.logo && (
            <Box display="flex" justifyContent="center" mb={2}>
              <img src={branding.logo} alt="Logo" style={{ maxHeight: 80 }} />
            </Box>
          )}
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            sx={{ fontWeight: 'bold', mb: 1, color: '#fff', letterSpacing: 1 }}
          >
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Typography>
          <Typography 
            component="h2" 
            variant="body1" 
            align="center" 
            sx={{ color: '#aaa', mb: 4 }}
          >
            {branding?.companyName || 'SuzanoIT QA'} • {branding?.platformName || 'Gestão de Testes'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={isLogin ? "E-mail de Acesso" : "Nome Completo"}
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, background: 'rgba(0,0,0,0.2)' }
                }
              }}
            />

            {!isLogin && (
              <Fade in={!isLogin} timeout={500}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-mail Corporativo"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#888' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, background: 'rgba(0,0,0,0.2)' }
                    }
                  }}
                />
              </Fade>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, background: 'rgba(0,0,0,0.2)' }
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 2, 
                borderRadius: 2, 
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                boxShadow: '0 4px 15px rgba(42, 82, 152, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2a5298 0%, #1e3c72 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'ACESSAR PLATAFORMA' : 'CADASTRAR-SE')}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                color="secondary" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
