import { api } from './apiClient';
export interface Project {
  id?: string;

  name: string;
  description: string;
  version: string;
  status: string;
  managerName: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ProjectService = {
  getAll: async (): Promise<Project[]> => {
    const res = await api.get(`/projects`);
    return res.data;
  },
  create: async (project: Project): Promise<Project> => {
    const res = await api.post(`/projects`, project);
    return res.data;
  },
  update: async (id: string, project: Project): Promise<Project> => {
    const res = await api.put(`/projects/${id}`, project);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};

export interface Sprint {
  id?: string;
  projectId: string;
  name: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const SprintService = {
  getAll: async (): Promise<Sprint[]> => {
    const res = await api.get(`/sprints`);
    return res.data;
  },
  create: async (sprint: Sprint): Promise<Sprint> => {
    const res = await api.post(`/sprints`, sprint);
    return res.data;
  },
  update: async (sprint: Sprint): Promise<Sprint> => {
    const res = await api.put(`/sprints/${sprint.id}`, sprint);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sprints/${id}`);
  }
};

export interface IntegrationConfig {
  id?: string;
  type: string;
  url: string;
  apiToken: string;
  projectId?: string;
}

export const IntegrationService = {
  getAll: async (): Promise<IntegrationConfig[]> => {
    const res = await api.get(`/integrations`);
    return res.data;
  },
  save: async (config: IntegrationConfig): Promise<IntegrationConfig> => {
    const res = await api.post(`/integrations`, config);
    return res.data;
  }
};

export const AiService = {
  generateBdd: async (context: string): Promise<{ preConditions: string, steps: string, expectedResult: string }> => {
    const res = await api.post(`/ai/generate-bdd`, { context });
    return res.data;
  },
  generatePlaywright: async (gherkin: string) => {
    const res = await api.post(`/ai/generate-playwright`, { gherkin });
    return res.data;
  }
};

export interface ApiTesterRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
}

export interface ApiTestPlan {
  id?: string;
  name: string;
  description?: string;
  projectId?: string;
  testCaseId?: string;
  requests?: ApiTestRequest[];
}

export interface ApiTestRequest {
  id?: string;
  planId: string;
  name: string;
  method: string;
  url: string;
  headers?: string;
  body?: string;
  expectedStatus: number;
}

export interface ApiTestExecution {
  id: string;
  planId: string;
  status: string;
  executionTimeMs: number;
  successRate: number;
  createdAt: string;
}

export const ApiTesterService = {
  execute: async (request: ApiTesterRequest): Promise<{ status: number, headers: Record<string, string>, body: string, timeMs: number }> => {
    try {
      const res = await api.post(`/tester/execute`, request);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
};

export const ApiTestPlanService = {
  getAll: async (): Promise<ApiTestPlan[]> => {
    const res = await api.get(`/tester/plans`);
    return res.data;
  },
  create: async (plan: ApiTestPlan): Promise<ApiTestPlan> => {
    const res = await api.post(`/tester/plans`, plan);
    return res.data;
  },
  addRequest: async (planId: string, request: ApiTestRequest): Promise<ApiTestRequest> => {
    const res = await api.post(`/tester/plans/${planId}/requests`, request);
    return res.data;
  },
  executePlan: async (planId: string): Promise<ApiTestExecution> => {
    const res = await api.post(`/tester/plans/${planId}/execute`);
    return res.data;
  },
  getRecentExecutions: async (): Promise<ApiTestExecution[]> => {
    const res = await api.get(`/tester/executions/recent`);
    return res.data;
  }
};

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  profile: string;
  projectIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const UserService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get(`/users`);
    return res.data;
  },
  create: async (user: User): Promise<User> => {
    const res = await api.post(`/users`, user);
    return res.data;
  },
  update: async (user: User): Promise<User> => {
    const res = await api.put(`/users/${user.id}`, user);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
  login: async (credentials: any) => {
    const response = await api.post(`/auth/login`, credentials);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post(`/auth/forgot-password`, { email });
    return response.data;
  }
};

export interface Requirement {
  id?: string;
  projectId: string;
  code: string;
  title: string;
  description: string;
  source: string;
  priority: string;
  criticality: string;
  sprint: string;
  releaseVersion: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const RequirementService = {
  getAll: async (): Promise<Requirement[]> => {
    const res = await api.get(`/requirements`);
    return res.data;
  },
  create: async (requirement: Requirement): Promise<Requirement> => {
    const res = await api.post(`/requirements`, requirement);
    return res.data;
  }
};

export interface Module {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ModuleService = {
  getAll: async (): Promise<Module[]> => {
    const res = await api.get(`/settings/modules`);
    return res.data;
  },
  create: async (module: Module): Promise<Module> => {
    const res = await api.post(`/settings/modules`, module);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/settings/modules/${id}`);
  }
};

export interface Category {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CategoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get(`/settings/categories`);
    return res.data;
  },
  create: async (category: Category): Promise<Category> => {
    const res = await api.post(`/settings/categories`, category);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/settings/categories/${id}`);
  }
};

export interface Feature {
  id?: string;
  moduleId: string;
  categoryId?: string | null;
  code?: string | null;
  name: string;
  description: string;
  objective?: string | null;
  status?: string | null;
  priority?: string | null;
  version?: string | null;
  permissions?: string | null;
  dependencies?: string | null;
  tags?: string | null;
  iconName?: string | null;
  color?: string | null;
  menuOrder?: number;
  url?: string | null;
  visibleInMenu?: boolean;
  showInDashboard?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const FeatureService = {
  getAll: async (): Promise<Feature[]> => {
    const res = await api.get(`/features`);
    return res.data;
  },
  create: async (feature: Feature): Promise<Feature> => {
    const res = await api.post(`/features`, feature);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/features/${id}`);
  }
};

export interface TestCaseFolder {
  id?: string;
  projectId: string;
  parentId?: string | null;
  name: string;
}

export const TestCaseFolderService = {
  getAll: async (projectId: string): Promise<TestCaseFolder[]> => {
    const res = await api.get(`/test-case-folders/project/${projectId}`);
    return res.data;
  },
  create: async (folder: TestCaseFolder): Promise<TestCaseFolder> => {
    const res = await api.post(`/test-case-folders`, folder);
    return res.data;
  },
  update: async (folder: TestCaseFolder): Promise<TestCaseFolder> => {
    const res = await api.put(`/test-case-folders/${folder.id}`, folder);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-case-folders/${id}`);
  }
};

export interface TestCase {
  id?: string;
  featureId?: string | null;
  folderId?: string | null;
  requirementId?: string | null;
  title: string;
  description: string;
  type: string;
  status: string;
  gherkinContent: string;
  category?: string;
  functionality?: string;
  priority?: string;
  preConditions?: string;
  expectedResult?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TestCaseService = {
  getAll: async (): Promise<TestCase[]> => {
    const res = await api.get(`/test-cases`);
    return res.data;
  },
  create: async (testCase: TestCase): Promise<TestCase> => {
    const res = await api.post(`/test-cases`, testCase);
    return res.data;
  },
  update: async (testCase: TestCase): Promise<TestCase> => {
    const res = await api.put(`/test-cases/${testCase.id}`, testCase);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-cases/${id}`);
  }
};

export interface TestExecution {
  id?: string;
  name?: string;
  sprint?: string;
  testCaseId: string;
  testPlanId?: string | null;
  testerId?: string;
  environment?: string;
  status: string;
  repositoryProvider?: string;
  repositoryUrl?: string;
  repositoryBranch?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TestExecutionService = {
  getAll: async (): Promise<TestExecution[]> => {
    const res = await api.get(`/test-executions`);
    return res.data;
  },
  create: async (execution: TestExecution): Promise<TestExecution> => {
    const res = await api.post(`/test-executions`, execution);
    return res.data;
  },
  update: async (execution: TestExecution): Promise<TestExecution> => {
    const res = await api.put(`/test-executions/${execution.id}`, execution);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-executions/${id}`);
  }
};

export interface Defect {
  id?: string;
  testExecutionId?: string;
  testCaseId: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DefectService = {
  getAll: async (): Promise<Defect[]> => {
    const res = await api.get(`/defects`);
    return res.data;
  },
  create: async (defect: Defect): Promise<Defect> => {
    const res = await api.post(`/defects`, defect);
    return res.data;
  },
  update: async (defect: Defect): Promise<Defect> => {
    const res = await api.put(`/defects/${defect.id}`, defect);
    return res.data;
  }
};

export interface TestPlan {
  id?: string;
  projectId: string;
  sprintId?: string | null;
  name: string;
  description?: string;
  environment?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTestPlanRequest {
  testPlan: TestPlan;
  testCaseIds: string[];
}

export const TestPlanService = {
  getByProject: async (projectId: string): Promise<TestPlan[]> => {
    const res = await api.get(`/test-plans/project/${projectId}`);
    return res.data;
  },
  create: async (request: CreateTestPlanRequest): Promise<TestPlan> => {
    const res = await api.post(`/test-plans`, request);
    return res.data;
  },
  update: async (plan: TestPlan): Promise<TestPlan> => {
    const res = await api.put(`/test-plans/${plan.id}`, plan);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-plans/${id}`);
  }
};

export interface Environment {
  id?: string;
  name: string;
  description?: string;
  baseUrl?: string;
  type?: string;
  status: string;
  color?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const EnvironmentService = {
  getAll: async (): Promise<Environment[]> => {
    const res = await api.get(`/environments`);
    return res.data;
  },
  create: async (env: Environment): Promise<Environment> => {
    const res = await api.post(`/environments`, env);
    return res.data;
  },
  update: async (env: Environment): Promise<Environment> => {
    const res = await api.put(`/environments/${env.id}`, env);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/environments/${id}`);
  }
};

export interface ExecutionHistory {
  id?: string;
  testExecutionId?: string;
  testCaseId: string;
  environmentId?: string;
  userId?: string;
  startTime?: string;
  endTime?: string;
  durationMs?: number;
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  blockedSteps: number;
  status: string;
  browser?: string;
  browserVersion?: string;
  observations?: string;
}

export const ExecutionHistoryService = {
  getAll: async (): Promise<ExecutionHistory[]> => {
    const res = await api.get(`/execution-history`);
    return res.data;
  },
  create: async (history: ExecutionHistory): Promise<ExecutionHistory> => {
    const res = await api.post(`/execution-history`, history);
    return res.data;
  }
};

export interface SystemLog {
  id?: string;
  userId?: string;
  actionType: string;
  module: string;
  description?: string;
  ipAddress?: string;
  browser?: string;
  result?: string;
  createdAt?: string;
}

export const SystemLogService = {
  getAll: async (): Promise<SystemLog[]> => {
    const res = await api.get(`/system-logs`);
    return res.data;
  }
};

export interface AutomatedTestRun {
  id: string;
  projectId: string;
  name: string;
  environment?: string;
  framework: string;
  status: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  durationMs: number;
  executedAt: string;
}

export const AutomationIntegrationService = {
  getRunsByProject: async (projectId: string): Promise<AutomatedTestRun[]> => {
    const res = await api.get(`/integrations/automation/runs/project/${projectId}`);
    return res.data;
  }
};

// ==========================================
// METRICS & COVERAGE SERVICES (ANALYTICS)
// ==========================================

export interface KpiMetricsDto {
  passRate: number;
  defectsPerKloc: number;
  testVelocity: number;
  totalBugs: number;
}

export interface TrendDataDto {
  name: string;
  pass: number;
  fail: number;
  bugs: number;
}

export interface DefectDensityDto {
  name: string;
  density: number;
}

export interface CoverageGlobalDto {
  name: string;
  value: number;
  color: string;
}

export interface CoverageModuleDto {
  name: string;
  coberto: number;
  total: number;
}

export interface UncoveredRequirementDto {
  id: string;
  title: string;
  status: string;
  coverage: number;
}

export const MetricsService = {
  getKpis: async (projectId?: string): Promise<KpiMetricsDto> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/metrics/kpis${query}`);
    return res.data;
  },
  getTrend: async (projectId?: string): Promise<TrendDataDto[]> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/metrics/trend${query}`);
    return res.data;
  },
  getDefectDensity: async (projectId?: string): Promise<DefectDensityDto[]> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/metrics/defects/density${query}`);
    return res.data;
  }
};

export const CoverageService = {
  getGlobalCoverage: async (projectId?: string): Promise<CoverageGlobalDto[]> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/coverage/global${query}`);
    return res.data;
  },
  getModuleCoverage: async (projectId?: string): Promise<CoverageModuleDto[]> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/coverage/modules${query}`);
    return res.data;
  },
  getCriticalUncoveredRequirements: async (projectId?: string): Promise<UncoveredRequirementDto[]> => {
    const query = projectId && projectId !== 'all' ? `?projectId=${projectId}` : '';
    const res = await api.get(`/coverage/requirements/uncovered${query}`);
    return res.data;
  }
};
