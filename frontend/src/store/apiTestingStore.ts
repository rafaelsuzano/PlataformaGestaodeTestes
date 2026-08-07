import { create } from 'zustand';

export interface ApiCollection {
  id: string;
  projectId: string;
  parentId?: string | null;
  name: string;
  description?: string | null;
}

export interface ApiEnvironment {
  id: string;
  projectId: string;
  name: string;
  color?: string | null;
}

export interface ApiRequest {
  id: string;
  collectionId?: string | null;
  name: string;
  method: string;
  url: string;
  headers?: string | null;
  bodyType?: string | null;
  body?: string | null;
  preRequestScript?: string | null;
  postResponseScript?: string | null;
  authType?: string | null;
  authConfig?: string | null;
  expectedStatus: number;
}

interface ApiTestingState {
  collections: ApiCollection[];
  environments: ApiEnvironment[];
  selectedEnvironmentId: string | null;
  activeRequestId: string | null;
  activeRequest: ApiRequest | null;
  
  // Actions
  setCollections: (collections: ApiCollection[]) => void;
  setEnvironments: (envs: ApiEnvironment[]) => void;
  setSelectedEnvironment: (envId: string | null) => void;
  setActiveRequest: (request: ApiRequest | null) => void;
  updateActiveRequest: (updates: Partial<ApiRequest>) => void;
}

export const useApiTestingStore = create<ApiTestingState>((set) => ({
  collections: [],
  environments: [],
  selectedEnvironmentId: null,
  activeRequestId: null,
  activeRequest: null,
  
  setCollections: (collections) => set({ collections }),
  setEnvironments: (envs) => set({ environments: envs }),
  setSelectedEnvironment: (envId) => set({ selectedEnvironmentId: envId }),
  setActiveRequest: (request) => set({ 
    activeRequest: request, 
    activeRequestId: request ? request.id : null 
  }),
  updateActiveRequest: (updates) => set((state) => ({
    activeRequest: state.activeRequest 
      ? { ...state.activeRequest, ...updates } 
      : null
  }))
}));
