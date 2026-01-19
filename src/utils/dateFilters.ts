import type { TimeFilter } from '../contexts/FilterContext';

/**
 * Traduz o filtro selecionado (texto) para datas reais (Start/End)
 * O Backend precisa receber datas, não strings como "Last Week".
 */
export function getDateRange(filter: TimeFilter): { startDate: Date; endDate: Date } {
  const now = new Date();
  // Zera as horas para evitar problemas de fuso horário na comparação simples
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (filter) {
    case 'Today':
      // Backend espera um range. Para "hoje", start e end são iguais (ou D-1 se preferir ver ontem)
      return {
        startDate: today,
        endDate: today
      };
      
    case 'Last Week':
      const currentDayOfWeek = now.getDay(); // 0 = Domingo
      const daysToLastSunday = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
      
      const lastSunday = new Date(today);
      lastSunday.setDate(lastSunday.getDate() - daysToLastSunday);
      
      const lastWeekStart = new Date(lastSunday);
      lastWeekStart.setDate(lastSunday.getDate() - 6); // Segunda anterior
      
      return {
        startDate: lastWeekStart,
        endDate: lastSunday
      };
      
    case 'Month':
    default:
      // Dia 1 do mês atual até hoje
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: today
      };
  }
}