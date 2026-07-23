import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { brandingService, TenantBranding } from '../services/brandingService';

interface BrandingContextData {
  branding: TenantBranding | null;
  loading: boolean;
  updateBranding: (branding: TenantBranding) => Promise<void>;
  uploadAsset: (file: File) => Promise<string>;
}

const BrandingContext = createContext<BrandingContextData>({} as BrandingContextData);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const data = await brandingService.getBranding('default'); // Pode vir de subdomínio ou token no futuro
      setBranding(data);
      applyCssVariables(data);
    } catch (error) {
      console.error('Failed to load branding', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBranding = async (newBranding: TenantBranding) => {
    try {
      const data = await brandingService.updateBranding(newBranding, 'default');
      setBranding(data);
      applyCssVariables(data);
    } catch (error) {
      console.error('Failed to update branding', error);
      throw error;
    }
  };

  const uploadAsset = async (file: File) => {
    return brandingService.uploadAsset(file, 'default');
  };

  const applyCssVariables = (data: TenantBranding) => {
    const root = document.documentElement;
    if (data.primaryColor) root.style.setProperty('--primary-color', data.primaryColor);
    if (data.secondaryColor) root.style.setProperty('--secondary-color', data.secondaryColor);
    if (data.accentColor) root.style.setProperty('--accent-color', data.accentColor);
    if (data.menuColor) root.style.setProperty('--menu-color', data.menuColor);
    if (data.headerColor) root.style.setProperty('--header-color', data.headerColor);
    if (data.backgroundColor) root.style.setProperty('--background-color', data.backgroundColor);
    if (data.buttonColor) root.style.setProperty('--button-color', data.buttonColor);
    if (data.font) root.style.setProperty('--font-family', data.font);
    
    if (data.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = data.favicon;
    }
    
    if (data.platformName || data.companyName) {
        document.title = data.platformName || data.companyName || 'Plataforma QA';
    }
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading, updateBranding, uploadAsset }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);
