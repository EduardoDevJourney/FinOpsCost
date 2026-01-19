import { useState, useEffect, useCallback } from 'react'
import { fetchDashboardData } from '../services/azure-dashboard'
import { useFilters } from '../contexts/FilterContext'
import { getDateRange } from '../utils/dateFilters'

// Importando do seu novo arquivo de tipos
import type { DashboardUiData } from '../services/types/dashboard'

export default function useDashboardData() {
  const [data, setData] = useState<DashboardUiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Pegamos o contexto: timeFilter ('Month', 'Today') e dateRange (se for custom)
  const { timeFilter, dateRange: customDateRange } = useFilters()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. DETERMINAR AS DATAS REAIS
      let start: Date;
      let end: Date;

      if (timeFilter === 'Custom Range' && customDateRange) {
        start = customDateRange.startDate;
        end = customDateRange.endDate;
      } else {
        // Usa a função utilitária para calcular datas baseadas em "Last Week", "Month", etc.
        const range = getDateRange(timeFilter);
        start = range.startDate;
        end = range.endDate;
      }

      // =================================================================
      // 🚨 DEV MODE: FORÇAR NOVEMBRO 2025
      // Como seu banco só tem dados de Nov/25, se usarmos new Date() (hoje)
      // vai vir tudo zerado. Vamos sobrescrever temporariamente.
      // =================================================================
      console.warn("⚠️ DEV MODE ATIVO: Forçando datas para Novembro 2025");
      start = new Date(2025, 10, 1);  // 01/11/2025
      end = new Date(2025, 10, 30);   // 30/11/2025
      // =================================================================

      // 2. PREPARAR O MÊS DE REFERÊNCIA (Para os Top 10)
      // Formato YYYY-MM
      const referenceMonth = start.toISOString().slice(0, 7);

      console.log('📡 Chamando API:', { 
        filter: timeFilter, 
        start: start.toLocaleDateString(), 
        end: end.toLocaleDateString() 
      });

      // 3. CHAMADA API (O Adapter lá no service já devolve formatado)
      const dashboardData = await fetchDashboardData({
        startDate: start,
        endDate: end,
        referenceMonth: referenceMonth
      });

      setData(dashboardData);

    } catch (err) {
      console.error('❌ Erro no Hook:', err);
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, customDateRange]) // Recarrega se o filtro mudar

  // Carrega na montagem e nas mudanças de filtro
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData // Expõe função para tentar de novo ou atualizar manual
  }
}