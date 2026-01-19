// Interfaces da API do back-end
export interface ApiTagStatistic {
  tag: string;
  value: string;
  resourceCount: number;
  cost: number;
}

export interface ApiTagCompliance {
  name: string;
  compliant: number;
  nonCompliant: number;
}

export interface ApiTagAnalysis {
  tag_name: string;
  compliance: ApiTagCompliance;
  statistics: ApiTagStatistic[];
  total_resources: number;
  total_cost: number;
}

export interface ApiTagComplianceResponse {
  subscription_name: string;
  tag_analysis: ApiTagAnalysis[];
}

// Interfaces processadas para uso no front-end
export interface TagSeries {
  name: string;
  compliant: number;
  nonCompliant: number;
  totalResources: number;
  totalCost: number;
  subscriptionName: string;
  [key: string]: number | string;
}

export interface TagReport {
  tag: string;
  value: string;
  resourceCount: number;
  cost: number;
  subscriptionName: string;
}

// Função para processar dados da API em TagSeries (agregado por tag)
function processTagSeries(apiData: ApiTagComplianceResponse[]): TagSeries[] {
  const tagMap = new Map<string, {
    compliant: number;
    nonCompliant: number;
    totalResources: number;
    totalCost: number;
    subscriptions: Set<string>;
  }>();
  
  console.log(`📈 Processando ${apiData.length} subscriptions para TagSeries...`);
  
  // Agregar dados de todas as subscriptions por tag
  apiData.forEach((subscription, subIndex) => {
    console.log(`   Subscription ${subIndex + 1}: ${subscription.subscription_name}`);
    
    subscription.tag_analysis.forEach(tag => {
      const existing = tagMap.get(tag.tag_name) || {
        compliant: 0,
        nonCompliant: 0,
        totalResources: 0,
        totalCost: 0,
        subscriptions: new Set<string>()
      };
      
      console.log(`     Agregando tag: ${tag.tag_name} (${tag.compliance.compliant}/${tag.compliance.nonCompliant})`);
      
      existing.compliant += tag.compliance.compliant;
      existing.nonCompliant += tag.compliance.nonCompliant;
      existing.totalResources += tag.total_resources;
      existing.totalCost += tag.total_cost;
      existing.subscriptions.add(subscription.subscription_name);
      
      tagMap.set(tag.tag_name, existing);
    });
  });
  
  // Converter Map para array
  const result = Array.from(tagMap.entries()).map(([tagName, data]) => ({
    name: tagName,
    compliant: data.compliant,
    nonCompliant: data.nonCompliant,
    totalResources: data.totalResources,
    totalCost: data.totalCost,
    subscriptionName: `${data.subscriptions.size} subscription(s)` // Indica quantas subscriptions têm essa tag
  }));
  
  console.log(`✅ TagSeries processadas: ${result.length} tags agregadas`);
  result.forEach(tag => {
    console.log(`   ${tag.name}: ${tag.compliant} compliant, ${tag.nonCompliant} non-compliant`);
  });
  
  return result;
}

// Função para processar dados da API em TagReports
function processTagReports(apiData: ApiTagComplianceResponse[]): TagReport[] {
  const tagReports: TagReport[] = [];
  
  console.log(`📊 Processando ${apiData.length} subscriptions para TagReports...`);
  
  apiData.forEach((subscription, subIndex) => {
    console.log(`   Subscription ${subIndex + 1}: ${subscription.subscription_name} - ${subscription.tag_analysis.length} tags`);
    
    subscription.tag_analysis.forEach((tag, tagIndex) => {
      console.log(`     Tag ${tagIndex + 1}: ${tag.tag_name} - ${tag.statistics.length} statistics`);
      
      tag.statistics.forEach(stat => {
        tagReports.push({
          tag: stat.tag,
          value: stat.value,
          resourceCount: stat.resourceCount,
          cost: stat.cost,
          subscriptionName: subscription.subscription_name
        });
      });
    });
  });
  
  console.log(`✅ Total de ${tagReports.length} tag reports processados`);
  return tagReports;
}

// Chamada real à API
export async function fetchTagSeries(): Promise<TagSeries[]> {
  try {
    // Importação dinâmica para evitar problemas de circular dependency
    const { apiRequest } = await import('../config/api');
    
    console.log('🏷️  Buscando dados de compliance de tags...');
    const { API_CONFIG } = await import('../config/api');
    const apiData = await apiRequest<ApiTagComplianceResponse[]>(API_CONFIG.ENDPOINTS.TAGS_COMPLIANCE);
    console.log('✅ Dados de tags recebidos com sucesso');
    
    return processTagSeries(apiData);
  } catch (error) {
    console.error('❌ Erro ao buscar dados de tags, usando dados mock:', error);
    return fetchMockTagSeries();
  }
}

export async function fetchTagReports(): Promise<TagReport[]> {
  try {
    // Importação dinâmica para evitar problemas de circular dependency
    const { apiRequest } = await import('../config/api');
    
    console.log('📊 Buscando relatórios de tags...');
    const { API_CONFIG } = await import('../config/api');
    const apiData = await apiRequest<ApiTagComplianceResponse[]>(API_CONFIG.ENDPOINTS.TAGS_COMPLIANCE);
    console.log('✅ Relatórios de tags recebidos com sucesso');
    
    return processTagReports(apiData);
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios de tags, usando dados mock:', error);
    return fetchMockTagReports();
  }
}

// Dados mock que simulam a resposta da API
function getMockApiData(): ApiTagComplianceResponse[] {
  return [
    {
      subscription_name: "Brazil AVD",
      tag_analysis: [
        {
          tag_name: "Cost Center",
          compliance: {
            name: "Cost Center",
            compliant: 150,
            nonCompliant: 300
          },
          statistics: [
            {
              tag: "Cost Center",
              value: "1010685",
              resourceCount: 24899,
              cost: 203746.07
            },
            {
              tag: "Cost Center",
              value: "c000009.06.00.55.00.0511",
              resourceCount: 2522,
              cost: 25323.48
            }
          ],
          total_resources: 27421,
          total_cost: 229069.55
        },
        {
          tag_name: "Billing DXC",
          compliance: {
            name: "Billing DXC",
            compliant: 200,
            nonCompliant: 150
          },
          statistics: [
            {
              tag: "Billing DXC",
              value: "true",
              resourceCount: 15000,
              cost: 150000.00
            },
            {
              tag: "Billing DXC",
              value: "false",
              resourceCount: 5000,
              cost: 75000.00
            }
          ],
          total_resources: 20000,
          total_cost: 225000.00
        }
      ]
    },
    {
      subscription_name: "Production Subscription",
      tag_analysis: [
        {
          tag_name: "Cost Center",
          compliance: {
            name: "Cost Center",
            compliant: 800,
            nonCompliant: 200
          },
          statistics: [
            {
              tag: "Cost Center",
              value: "2020123",
              resourceCount: 5000,
              cost: 125000.00
            },
            {
              tag: "Cost Center", 
              value: "3030456",
              resourceCount: 3000,
              cost: 85000.00
            }
          ],
          total_resources: 8000,
          total_cost: 210000.00
        },
        {
          tag_name: "Environment",
          compliance: {
            name: "Environment",
            compliant: 700,
            nonCompliant: 100
          },
          statistics: [
            {
              tag: "Environment",
              value: "PROD",
              resourceCount: 6000,
              cost: 180000.00
            },
            {
              tag: "Environment",
              value: "DEV",
              resourceCount: 1000,
              cost: 25000.00
            }
          ],
          total_resources: 7000,
          total_cost: 205000.00
        }
      ]
    },
    {
      subscription_name: "Development Subscription",
      tag_analysis: [
        {
          tag_name: "Billing DXC",
          compliance: {
            name: "Billing DXC",
            compliant: 400,
            nonCompliant: 100
          },
          statistics: [
            {
              tag: "Billing DXC",
              value: "true",
              resourceCount: 3500,
              cost: 87500.00
            },
            {
              tag: "Billing DXC",
              value: "false",
              resourceCount: 1500,
              cost: 37500.00
            }
          ],
          total_resources: 5000,
          total_cost: 125000.00
        }
      ]
    }
  ];
}

// Funções mock para desenvolvimento/testes (mantidas como fallback)
function fetchMockTagSeries(): Promise<TagSeries[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const mockApiData = getMockApiData();
      const processedSeries = processTagSeries(mockApiData);
      resolve(processedSeries);
    }, 500)
  );
}

function fetchMockTagReports(): Promise<TagReport[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockApiData = getMockApiData();
      const processedReports = processTagReports(mockApiData);
      resolve(processedReports);
    }, 500);
  });
}
