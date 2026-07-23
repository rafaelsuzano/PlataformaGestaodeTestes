import React, { useState, useEffect, useRef } from 'react';
import { useBranding } from '../contexts/BrandingContext';
import { Card, CardContent, CardHeader, Typography, TextField, Button, Grid, Box, Tabs, Tab, CircularProgress, Snackbar, Alert } from '@mui/material';

export const WhiteLabelSettings = () => {
  const { branding, loading, updateBranding, uploadAsset } = useBranding();
  const [currentTab, setCurrentTab] = useState(0);
  const [form, setForm] = useState(branding || {});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (branding) {
      setForm(branding);
    }
  }, [branding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadAsset(e.target.files[0]);
        setForm(prev => ({ ...prev, [fieldName]: url }));
      } catch (error) {
        console.error('Upload failed', error);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateBranding(form as any);
      setSuccess(true);
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" mb={4}>Configurações White Label</Typography>
      <Card>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} textColor="primary" indicatorColor="primary">
          <Tab label="Identidade" />
          <Tab label="Cores" />
          <Tab label="Logos e Imagens" />
        </Tabs>
        <CardContent>
          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nome da Empresa" name="companyName" value={form.companyName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Nome da Plataforma" name="platformName" value={form.platformName || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Fonte Principal (CSS Font-Family)" name="font" value={form.font || ''} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tema Base (dark | light)" name="theme" value={form.theme || ''} onChange={handleChange} />
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Cor Primária" name="primaryColor" value={form.primaryColor || '#6366f1'} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Cor Secundária" name="secondaryColor" value={form.secondaryColor || '#ec4899'} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Cor de Destaque" name="accentColor" value={form.accentColor || '#ffffff'} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Fundo da Plataforma" name="backgroundColor" value={form.backgroundColor || '#0B0F19'} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Cor do Menu Lateral" name="menuColor" value={form.menuColor || '#101524'} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="color" label="Cor do Cabeçalho" name="headerColor" value={form.headerColor || '#101524'} onChange={handleChange} />
              </Grid>
            </Grid>
          )}

          {currentTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Logo Principal</Typography>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                {form.logo && <Box mt={2}><img src={form.logo} alt="Logo" style={{ maxHeight: 60 }} /></Box>}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Logo Reduzida</Typography>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoSmall')} />
                {form.logoSmall && <Box mt={2}><img src={form.logoSmall} alt="Logo Small" style={{ maxHeight: 40 }} /></Box>}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Favicon</Typography>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'favicon')} />
                {form.favicon && <Box mt={2}><img src={form.favicon} alt="Favicon" style={{ maxHeight: 32 }} /></Box>}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Imagem de Fundo (Login)</Typography>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'backgroundImage')} />
                {form.backgroundImage && <Box mt={2}><img src={form.backgroundImage} alt="Background" style={{ maxHeight: 100 }} /></Box>}
              </Grid>
            </Grid>
          )}

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Salvar Alterações'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Configurações salvas com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};
