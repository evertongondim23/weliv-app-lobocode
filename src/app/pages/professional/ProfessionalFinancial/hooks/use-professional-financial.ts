import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../contexts/AuthContext';
import { useData } from '../../../../contexts/DataContext';
import type { FinancialPeriod } from '../types/professional-financial.types';
import {
  buildChartData,
  computeFinancialMetrics,
  filterAppointmentsByPeriod,
  getPendingConfirmation,
} from '../utils/professional-financial.utils';

export function useProfessionalFinancial() {
  const { user } = useAuth();
  const { appointments, updateAppointment, professionals } = useData();
  const [period, setPeriod] = useState<FinancialPeriod>('monthly');

  const professional = professionals.find((p) => p.id === user?.id);
  const myAppointments = appointments.filter((apt) => apt.professionalId === user?.id);
  const consultationPrice = professional?.consultationPrice || 0;

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const pendingConfirmation = useMemo(
    () => getPendingConfirmation(myAppointments, todayStr),
    [myAppointments, todayStr],
  );

  const { periodLabel, chartData, metrics } = useMemo(() => {
    const { filteredAppointments, periodLabel: label } = filterAppointmentsByPeriod(
      period,
      myAppointments,
      today,
    );
    const chart = buildChartData(period, myAppointments, consultationPrice, today);
    const computedMetrics = computeFinancialMetrics(filteredAppointments, consultationPrice);

    return {
      periodLabel: label,
      chartData: chart,
      metrics: computedMetrics,
    };
  }, [period, myAppointments, consultationPrice, today]);

  const handleConfirmAppointment = (appointmentId: string, status: 'completed' | 'no-show') => {
    updateAppointment(appointmentId, { status });
    toast.success(
      status === 'completed' ? 'Consulta confirmada como realizada!' : 'Falta registrada',
    );
  };

  return {
    welcome: { periodLabel },
    filters: { period, onPeriodChange: setPeriod },
    todayConfirmation: {
      appointments: pendingConfirmation,
      onConfirm: handleConfirmAppointment,
    },
    summary: metrics,
    charts: { period, chartData },
    detailedBreakdown: { metrics, consultationPrice },
    generalSummary: { period, metrics, consultationPrice },
  };
}
