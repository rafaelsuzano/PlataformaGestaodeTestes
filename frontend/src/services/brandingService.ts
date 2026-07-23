export interface TenantBranding {
  id?: string;
  tenantId: string;
  companyName?: string;
  platformName?: string;
  logo?: string;
  logoSmall?: string;
  favicon?: string;
  backgroundImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  menuColor?: string;
  headerColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  font?: string;
  theme?: string;
}

const API_BASE = '/api/v1/branding';

export const brandingService = {
  getBranding: async (tenantId: string = 'default'): Promise<TenantBranding> => {
    const response = await fetch(API_BASE, {
      headers: {
        'X-Tenant-ID': tenantId
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch branding');
    }
    return response.json();
  },

  updateBranding: async (branding: TenantBranding, tenantId: string = 'default'): Promise<TenantBranding> => {
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId
      },
      body: JSON.stringify(branding)
    });
    if (!response.ok) {
      throw new Error('Failed to update branding');
    }
    return response.json();
  },

  uploadAsset: async (file: File, tenantId: string = 'default'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'X-Tenant-ID': tenantId
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to upload asset');
    }
    const data = await response.json();
    return data.url;
  }
};
