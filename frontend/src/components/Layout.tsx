import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FolderIcon from '@mui/icons-material/Folder';
import ScienceIcon from '@mui/icons-material/Science';
import BugReportIcon from '@mui/icons-material/BugReport';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupIcon from '@mui/icons-material/Group';
import ExtensionIcon from '@mui/icons-material/Extension';
import HttpIcon from '@mui/icons-material/Http';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const drawerWidth = 240;

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Projetos', icon: <FolderIcon />, path: '/projetos' },
    { text: 'Usuários e Acessos', icon: <GroupIcon />, path: '/usuarios' },
    { text: 'Requisitos', icon: <AssignmentIcon />, path: '/requisitos' },
    { text: 'Sprints (Ciclos)', icon: <DateRangeIcon />, path: '/sprints' },
    { text: 'Casos de Teste', icon: <ScienceIcon />, path: '/casos-teste' },
    { text: 'Testador de API', icon: <HttpIcon />, path: '/api-tester' },
    { text: 'Central de API', icon: <AccountTreeIcon />, path: '/central-api' },
    { text: 'Execução', icon: <PlayArrowIcon />, path: '/execucao' },
    { text: 'Defeitos', icon: <BugReportIcon />, path: '/defeitos' },
    { text: 'Integrações', icon: <ExtensionIcon />, path: '/integracoes' }
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.text : 'Plataforma de Gestão de Testes';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>QA</Typography>
            </Box>
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SuzanoIT - {getPageTitle()}
          </Typography>
          <Button 
            variant="outlined"
            color="primary" 
            size="small"
            onClick={onLogout}
            sx={{ borderRadius: 6, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    selected={isActive}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      ...(isActive && {
                        background: 'rgba(99, 102, 241, 0.15)',
                        '&:hover': { background: 'rgba(99, 102, 241, 0.2)' }
                      })
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#818cf8' : '#6b7280', minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? '#fff' : '#9ca3af',
                            fontSize: '0.9rem'
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
