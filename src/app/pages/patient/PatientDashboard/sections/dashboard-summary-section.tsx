import { DashboardStatCard } from '../components/dashboard-stat-card';
import type { DashboardSummarySectionProps } from '../types/patient-dashboard.types';

export function DashboardSummarySection({ stats }: DashboardSummarySectionProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <DashboardStatCard key={index} {...stat} />
      ))}
    </div>
  );
}
