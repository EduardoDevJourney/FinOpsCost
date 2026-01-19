// src/config/api.ts

// Configuração base da API
export const API_CONFIG = {
  // URL base da API (pode ser configurada via variáveis de ambiente)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Endpoints
  ENDPOINTS: {
    DASHBOARD: '/dashboard/legacy',
    TAGS: '/tags',
    TAGS_COMPLIANCE: '/tags/compliance/global'
  },
  
  // Timeouts específicos (em ms)
  TIMEOUTS: {
    // Dashboard legacy otimizado - 30 segundos
    DASHBOARD: 30000,
    // Outras operações - 30 segundos
    DEFAULT: 30000
  },
  
  // Timeout padrão (em ms) - mantido para compatibilidade
  DEFAULT_TIMEOUT: 30000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// Função utilitária para construir URLs completas
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Função utilitária para fazer requisições com configurações padrão
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint);
  
  // Determina o timeout baseado no endpoint
  let timeout: number = API_CONFIG.TIMEOUTS.DEFAULT;
  if (endpoint === API_CONFIG.ENDPOINTS.DASHBOARD) {
    timeout = API_CONFIG.TIMEOUTS.DASHBOARD;
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    },
    signal: AbortSignal.timeout(timeout)
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Função específica para requisições do dashboard com timeout estendido
export async function apiRequestDashboard<T>(options: RequestInit = {}): Promise<T> {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD);
  
  const dashboardOptions: RequestInit = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers
    },
    signal: AbortSignal.timeout(API_CONFIG.TIMEOUTS.DASHBOARD),
    ...options
  };
  
  const response = await fetch(url, dashboardOptions);
  
  if (!response.ok) {
    throw new Error(`Dashboard API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}