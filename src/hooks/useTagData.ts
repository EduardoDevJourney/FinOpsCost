import { useState, useEffect, useCallback } from 'react';
import type { TagSeries, TagReport } from '../services/tags';
import { fetchTagSeries, fetchTagReports } from '../services/tags';

export default function useTagData() {
  const [series, setSeries] = useState<TagSeries[]>([]);
  const [reports, setReports] = useState<TagReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🏷️  Carregando dados de compliance de tags...');
      const [tagSeries, tagReports] = await Promise.all([
        fetchTagSeries(), 
        fetchTagReports()
      ]);
      
      console.log(`✅ Tags carregadas: ${tagSeries.length} séries, ${tagReports.length} relatórios`);
      
      setSeries(tagSeries);
      setReports(tagReports);
      setLastFetch(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido ao carregar tags');
      setError(error);
      console.error('❌ Erro ao carregar dados de tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    series, 
    reports, 
    loading, 
    error, 
    lastFetch,
    refetch
  };
}
