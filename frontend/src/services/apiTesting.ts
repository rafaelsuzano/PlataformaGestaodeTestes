import { api } from './apiClient';
import type { ApiCollection, ApiEnvironment, ApiRequest } from '../store/apiTestingStore';

export const ApiCollectionService = {
  getAll: async (projectId: string): Promise<ApiCollection[]> => {
    const res = await api.get(`/api-testing/collections/project/${projectId}`);
    return res.data;
  },
  create: async (collection: ApiCollection): Promise<ApiCollection> => {
    const res = await api.post(`/api-testing/collections`, collection);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api-testing/collections/${id}`);
  }
};

export const ApiEnvironmentService = {
  getAll: async (projectId: string): Promise<ApiEnvironment[]> => {
    const res = await api.get(`/api-testing/environments/project/${projectId}`);
    return res.data;
  },
  create: async (env: ApiEnvironment): Promise<ApiEnvironment> => {
    const res = await api.post(`/api-testing/environments`, env);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api-testing/environments/${id}`);
  }
};

export const ApiRequestService = {
  // Para fins de mock no store. Na vida real traríamos as requisições atreladas às Collections.
  execute: async (request: ApiRequest, environmentId?: string | null): Promise<any> => {
    const res = await api.post(`/api-testing/engine/execute-request`, {
      ...request,
      environmentId
    });
    return res.data;
  }
};
