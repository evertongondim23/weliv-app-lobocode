import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '../../../../types';
import type { ChartDataPoint, FinancialMetrics, FinancialPeriod } from '../types/professional-financial.types';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export function getPendingConfirmation(appointments: Appointment[], todayStr: string): Appointment[] {
  const todayAppointments = appointments.filter((apt) => apt.date === todayStr);
  return todayAppointments.filter(
    (apt) => apt.status === 'scheduled' || apt.status === 'confirmed',
  );
}

export function buildChartData(
  period: FinancialPeriod,
  appointments: Appointment[],
  consultationPrice: number,
  today: Date = new Date(),
): ChartDataPoint[] {
  if (period === 'daily') {
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    return last7Days.map((day, index) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayAppointments = appointments.filter((apt) => apt.date === dayStr);
      const completed = dayAppointments.filter((apt) => apt.status === 'completed');

      return {
        id: `day-${index}`,
        name: format(day, 'EEE', { locale: ptBR }),
        data: format(day, 'dd/MM'),
        receita: completed.length * consultationPrice,
        consultas: completed.length,
      };
    });
  }

  if (period === 'monthly') {
    const last6Months = eachMonthOfInterval({
      start: subMonths(today, 5),
      end: today,
    });

    return last6Months.map((month, index) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= monthStart && aptDate <= monthEnd;
      });
      const completed = monthAppointments.filter((apt) => apt.status === 'completed');

      return {
        id: `month-${index}`,
        name: format(month, 'MMM', { locale: ptBR }),
        data: format(month, 'MMM/yy', { locale: ptBR }),
        receita: completed.length * consultationPrice,
        consultas: completed.length,
      };
    });
  }

  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);
  const monthsOfYear = eachMonthOfInterval({
    start: yearStart,
    end: yearEnd,
  });

  return monthsOfYear.map((month, index) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= monthStart && aptDate <= monthEnd;
    });
    const completed = monthAppointments.filter((apt) => apt.status === 'completed');

    return {
      id: `year-${index}`,
      name: format(month, 'MMM', { locale: ptBR }),
      data: format(month, 'MMM', { locale: ptBR }),
      receita: completed.length * consultationPrice,
      consultas: completed.length,
    };
  });
}

export function filterAppointmentsByPeriod(
  period: FinancialPeriod,
  appointments: Appointment[],
  today: Date = new Date(),
): { filteredAppointments: Appointment[]; periodLabel: string } {
  const todayStr = format(today, 'yyyy-MM-dd');

  if (period === 'daily') {
    return {
      filteredAppointments: appointments.filter((apt) => apt.date === todayStr),
      periodLabel: format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    };
  }

  if (period === 'monthly') {
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    return {
      filteredAppointments: appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= monthStart && aptDate <= monthEnd;
      }),
      periodLabel: format(today, "MMMM 'de' yyyy", { locale: ptBR }),
    };
  }

  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);
  return {
    filteredAppointments: appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= yearStart && aptDate <= yearEnd;
    }),
    periodLabel: format(today, 'yyyy'),
  };
}

export function computeFinancialMetrics(
  filteredAppointments: Appointment[],
  consultationPrice: number,
): FinancialMetrics {
  const completedAppointments = filteredAppointments.filter((apt) => apt.status === 'completed');
  const scheduledAppointments = filteredAppointments.filter(
    (apt) => apt.status === 'scheduled' || apt.status === 'confirmed',
  );
  const noShowAppointments = filteredAppointments.filter((apt) => apt.status === 'no-show');
  const cancelledAppointments = filteredAppointments.filter((apt) => apt.status === 'cancelled');

  const totalRevenue = completedAppointments.reduce((sum) => sum + consultationPrice, 0);
  const potentialRevenue = scheduledAppointments.reduce((sum) => sum + consultationPrice, 0);
  const lostRevenue =
    (noShowAppointments.length + cancelledAppointments.length) * consultationPrice;

  const totalAppointments = filteredAppointments.length;
  const noShowRate =
    totalAppointments > 0
      ? ((noShowAppointments.length / totalAppointments) * 100).toFixed(1)
      : '0';

  const remarcations = filteredAppointments.reduce((sum, apt) => sum + apt.remarcationCount, 0);
  const remarcationRate =
    totalAppointments > 0 ? ((remarcations / totalAppointments) * 100).toFixed(1) : '0';

  return {
    completedAppointments,
    scheduledAppointments,
    noShowAppointments,
    cancelledAppointments,
    totalRevenue,
    potentialRevenue,
    lostRevenue,
    totalAppointments,
    noShowRate,
    remarcations,
    remarcationRate,
  };
}
