import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Box, Typography, Button, TextField, Grid,
  Chip, Snackbar, Alert, CircularProgress, Card, CardContent, CardActions, Divider
} from '@mui/material';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { IntegrationService } from '../services/api';
import type { IntegrationConfig } from '../services/api';

export default function Integrations() {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState<Partial<IntegrationConfig>>({
    type: 'AZURE_DEVOPS', url: '', apiToken: '', projectId: ''
  });

  const { data: configs, isLoading } = useQuery({ queryKey: ['integrations'], queryFn: IntegrationService.getAll });

  const saveMutation = useMutation({
    mutationFn: IntegrationService.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setSnackbar({ open: true, message: 'Integração salva com sucesso!', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Erro ao salvar integração.', severity: 'error' });
    }
  });

  const handleSave = (type: string) => {
    const config = configs?.find((c: IntegrationConfig) => c.type === type);
    saveMutation.mutate({
      ...formData,
      type,
      id: config?.id
    } as IntegrationConfig);
  };

  const handleLoadConfig = (type: string) => {
    const config = configs?.find((c: IntegrationConfig) => c.type === type);
    if (config) {
      setFormData({ type: config.type, url: config.url, apiToken: config.apiToken, projectId: config.projectId });
    } else {
      setFormData({ type, url: '', apiToken: '', projectId: '' });
    }
  };

  const IntegrationCard = ({ title, type, color, description }: any) => {
    const isConfigured = configs?.some((c: IntegrationConfig) => c.type === type);
    const isEditing = formData.type === type;
    
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${color}` }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <Chip 
              label={isConfigured ? 'Conectado' : 'Não Configurado'} 
              color={isConfigured ? 'success' : 'default'} 
              size="small" 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
          
          {isEditing && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                size="small" label="URL Base" fullWidth 
                value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} 
              />
              <TextField 
                size="small" label="Token de Autenticação (PAT)" type="password" fullWidth 
                value={formData.apiToken || ''} onChange={e => setFormData({...formData, apiToken: e.target.value})} 
              />
              <TextField 
                size="small" label="ID do Projeto (Opcional)" fullWidth 
                value={formData.projectId || ''} onChange={e => setFormData({...formData, projectId: e.target.value})} 
              />
            </Box>
          )}
        </CardContent>
        <Divider />
        <CardActions>
          {!isEditing ? (
            <Button size="small" onClick={() => handleLoadConfig(type)} color="primary">Configurar</Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button size="small" onClick={() => setFormData({ type: '' })}>Cancelar</Button>
              <Button size="small" variant="contained" color="primary" onClick={() => handleSave(type)} disabled={saveMutation.isPending}>
                Salvar Credenciais
              </Button>
            </Box>
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Hub de Integrações</Typography>
        <Button variant="contained" color="secondary" startIcon={<CloudSyncIcon />}>
          Sincronização Manual
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Conecte a plataforma SuzanoIT QA com suas ferramentas favoritas de ALM para sincronizar Defeitos e Casos de Teste automaticamente.
      </Typography>

      {isLoading ? <CircularProgress /> : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntegrationCard 
              title="Azure DevOps" type="AZURE_DEVOPS" color="#0078d4" 
              description="Sincronize Bugs, Test Plans e Test Suites diretamente com o Azure Boards." 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntegrationCard 
              title="Jira Xray" type="JIRA_XRAY" color="#0052cc" 
              description="Importe requisitos e sincronize as execuções de testes com o plugin Xray." 
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <IntegrationCard 
              title="Jira Zephyr" type="JIRA_ZEPHYR" color="#172b4d" 
              description="Conexão direta com o Zephyr Scale ou Squad para rastreabilidade de testes." 
            />
          </Grid>
        </Grid>
      )}

      <Snackbar 
        open={snackbar.open} autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
