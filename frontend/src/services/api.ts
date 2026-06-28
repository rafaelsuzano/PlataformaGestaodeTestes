export interface Client {
  id?: string;
  name: string;
  corporateName: string;
  cnpj: string;
  contactName: string;
  contactEmail: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = 'http://localhost:8080/api';

export const ClientService = {
  getAll: async (): Promise<Client[]> => {
    const res = await fetch(`${API_URL}/clients`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },
  create: async (client: Client): Promise<Client> => {
    const res = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  }
};

export interface Project {
  id?: string;
  clientId: string;
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
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },
  create: async (project: Project): Promise<Project> => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
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
    const res = await fetch(`${API_URL}/sprints`);
    if (!res.ok) throw new Error('Failed to fetch sprints');
    return res.json();
  },
  create: async (sprint: Sprint): Promise<Sprint> => {
    const res = await fetch(`${API_URL}/sprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sprint)
    });
    if (!res.ok) throw new Error('Failed to create sprint');
    return res.json();
  },
  update: async (sprint: Sprint): Promise<Sprint> => {
    const res = await fetch(`${API_URL}/sprints/${sprint.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sprint)
    });
    if (!res.ok) throw new Error('Failed to update sprint');
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/sprints/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete sprint');
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
    const res = await fetch(`${API_URL}/integrations`);
    if (!res.ok) throw new Error('Failed to fetch integrations');
    return res.json();
  },
  save: async (config: IntegrationConfig): Promise<IntegrationConfig> => {
    const res = await fetch(`${API_URL}/integrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to save integration');
    return res.json();
  }
};

export const AiService = {
  generateBdd: async (context: string): Promise<{ preConditions: string, steps: string, expectedResult: string }> => {
    const res = await fetch(`${API_URL}/ai/generate-bdd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context })
    });
    if (!res.ok) throw new Error('Failed to generate BDD');
    return res.json();
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
    const res = await fetch(`${API_URL}/tester/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok && res.status !== 401 && res.status !== 403 && res.status !== 404 && res.status !== 500) {
      // The proxy itself returns 200 OK for successful proxying even if target returns 404, unless it throws completely
    }
    return res.json();
  }
};

export const ApiTestPlanService = {
  getAll: async (): Promise<ApiTestPlan[]> => {
    const res = await fetch(`${API_URL}/tester/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  },
  create: async (plan: ApiTestPlan): Promise<ApiTestPlan> => {
    const res = await fetch(`${API_URL}/tester/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!res.ok) throw new Error('Failed to create plan');
    return res.json();
  },
  addRequest: async (planId: string, request: ApiTestRequest): Promise<ApiTestRequest> => {
    const res = await fetch(`${API_URL}/tester/plans/${planId}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) throw new Error('Failed to add request');
    return res.json();
  },
  executePlan: async (planId: string): Promise<ApiTestExecution> => {
    const res = await fetch(`${API_URL}/tester/plans/${planId}/execute`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to execute plan');
    return res.json();
  },
  getRecentExecutions: async (): Promise<ApiTestExecution[]> => {
    const res = await fetch(`${API_URL}/tester/executions/recent`);
    if (!res.ok) throw new Error('Failed to fetch executions');
    return res.json();
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
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
  create: async (user: User): Promise<User> => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },
  update: async (user: User): Promise<User> => {
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete user');
  },
  login: async (credentials: any): Promise<User> => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Credenciais inválidas');
    return res.json();
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
    const res = await fetch(`${API_URL}/requirements`);
    if (!res.ok) throw new Error('Failed to fetch requirements');
    return res.json();
  },
  create: async (requirement: Requirement): Promise<Requirement> => {
    const res = await fetch(`${API_URL}/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requirement)
    });
    if (!res.ok) throw new Error('Failed to create requirement');
    return res.json();
  }
};

export interface Feature {
  id?: string;
  moduleId: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const FeatureService = {
  getAll: async (): Promise<Feature[]> => {
    const res = await fetch(`${API_URL}/features`);
    if (!res.ok) throw new Error('Failed to fetch features');
    return res.json();
  },
  create: async (feature: Feature): Promise<Feature> => {
    const res = await fetch(`${API_URL}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feature)
    });
    if (!res.ok) throw new Error('Failed to create feature');
    return res.json();
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
    const res = await fetch(`${API_URL}/test-case-folders/project/${projectId}`);
    if (!res.ok) throw new Error('Failed to fetch folders');
    return res.json();
  },
  create: async (folder: TestCaseFolder): Promise<TestCaseFolder> => {
    const res = await fetch(`${API_URL}/test-case-folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folder)
    });
    if (!res.ok) throw new Error('Failed to create folder');
    return res.json();
  },
  update: async (folder: TestCaseFolder): Promise<TestCaseFolder> => {
    const res = await fetch(`${API_URL}/test-case-folders/${folder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(folder)
    });
    if (!res.ok) throw new Error('Failed to update folder');
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/test-case-folders/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete folder');
  }
};

export interface TestCase {
  id?: string;
  featureId: string;
  folderId?: string | null;
  requirementId?: string | null;
  title: string;
  description: string;
  type: string;
  status: string;
  gherkinContent: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TestCaseService = {
  getAll: async (): Promise<TestCase[]> => {
    const res = await fetch(`${API_URL}/test-cases`);
    if (!res.ok) throw new Error('Failed to fetch test cases');
    return res.json();
  },
  create: async (testCase: TestCase): Promise<TestCase> => {
    const res = await fetch(`${API_URL}/test-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase)
    });
    if (!res.ok) throw new Error('Failed to create test case');
    return res.json();
  },
  update: async (testCase: TestCase): Promise<TestCase> => {
    const res = await fetch(`${API_URL}/test-cases/${testCase.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase)
    });
    if (!res.ok) throw new Error('Failed to update test case');
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/test-cases/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete test case');
  }
};

export interface TestExecution {
  id?: string;
  name?: string;
  sprint?: string;
  testCaseId: string;
  testerId?: string;
  environment?: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const TestExecutionService = {
  getAll: async (): Promise<TestExecution[]> => {
    const res = await fetch(`${API_URL}/test-executions`);
    if (!res.ok) throw new Error('Failed to fetch test executions');
    return res.json();
  },
  create: async (execution: TestExecution): Promise<TestExecution> => {
    const res = await fetch(`${API_URL}/test-executions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(execution)
    });
    if (!res.ok) throw new Error('Failed to create test execution');
    return res.json();
  },
  update: async (execution: TestExecution): Promise<TestExecution> => {
    const res = await fetch(`${API_URL}/test-executions/${execution.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(execution)
    });
    if (!res.ok) throw new Error('Failed to update test execution');
    return res.json();
  },
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/test-executions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete test execution');
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
    const res = await fetch(`${API_URL}/defects`);
    if (!res.ok) throw new Error('Failed to fetch defects');
    return res.json();
  },
  create: async (defect: Defect): Promise<Defect> => {
    const res = await fetch(`${API_URL}/defects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defect)
    });
    if (!res.ok) throw new Error('Failed to create defect');
    return res.json();
  },
  update: async (defect: Defect): Promise<Defect> => {
    const res = await fetch(`${API_URL}/defects/${defect.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defect)
    });
    if (!res.ok) throw new Error('Failed to update defect');
    return res.json();
  }
};
