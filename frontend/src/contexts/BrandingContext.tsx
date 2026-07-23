import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { brandingService } from '../services/brandingService';
import type { TenantBranding } from '../services/brandingService';

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

  const hexToHsl = (hex: string): string => {
    // Convert hex to rgb
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return `${h} ${s}% ${l}%`;
  };

  const applyCssVariables = (data: TenantBranding) => {
    const root = document.documentElement;
    // Inject directly to variables used by Tailwind config (as HSL components)
    if (data.primaryColor) root.style.setProperty('--primary', hexToHsl(data.primaryColor));
    if (data.secondaryColor) root.style.setProperty('--secondary', hexToHsl(data.secondaryColor));
    if (data.accentColor) root.style.setProperty('--accent', hexToHsl(data.accentColor));
    if (data.menuColor) root.style.setProperty('--sidebar', hexToHsl(data.menuColor));
    if (data.backgroundColor) root.style.setProperty('--background', hexToHsl(data.backgroundColor));
    
    // Also inject generic values for MUI Theme Provider and custom styling
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
