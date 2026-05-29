import { BarChart3, DollarSign } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import {
  CARD_BORDER_STYLE,
  TABS_BORDER_STYLE,
  TEXT_PRIMARY_COLOR,
} from '../constants/professional-financial.constants';
import type { FinancialChartsSectionProps } from '../types/professional-financial.types';

function getChartDescription(period: FinancialChartsSectionProps['period']) {
  if (period === 'daily') return 'Últimos 7 dias';
  if (period === 'monthly') return 'Últimos 6 meses';
  return 'Ano atual';
}

export function FinancialChartsSection({ period, chartData }: FinancialChartsSectionProps) {
  const description = getChartDescription(period);

  return (
    <Tabs defaultValue="revenue" className="w-full">
      <TabsList
        className="grid w-full grid-cols-2 h-auto gap-1 p-1.5 rounded-xl border-2 bg-white shadow-sm"
        style={TABS_BORDER_STYLE}
      >
        <TabsTrigger
          value="revenue"
          className="rounded-lg py-2.5 px-3 text-sm font-semibold text-[#6B5D53] gap-2 transition-all data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] hover:bg-[#FFF8E7]/80"
        >
          <DollarSign className="size-4 shrink-0" aria-hidden />
          Receita
        </TabsTrigger>
        <TabsTrigger
          value="appointments"
          className="rounded-lg py-2.5 px-3 text-sm font-semibold text-[#6B5D53] gap-2 transition-all data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:bg-[linear-gradient(135deg,_#FFA500,_#FF8C00)] hover:bg-[#FFF8E7]/80"
        >
          <BarChart3 className="size-4 shrink-0" aria-hidden />
          Consultas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="revenue" className="mt-6">
        <Card className="border-2" style={CARD_BORDER_STYLE}>
          <CardHeader>
            <CardTitle style={{ color: TEXT_PRIMARY_COLOR }}>Evolução de Faturamento</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} key={`revenue-${period}`}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                    'Receita',
                  ]}
                  labelFormatter={(label) => chartData.find((d) => d.name === label)?.data || label}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#FFA500"
                  fillOpacity={1}
                  fill="url(#colorReceita)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="mt-6">
        <Card className="border-2" style={CARD_BORDER_STYLE}>
          <CardHeader>
            <CardTitle style={{ color: TEXT_PRIMARY_COLOR }}>Número de Consultas</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} key={`appointments-${period}`}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [value, 'Consultas']}
                  labelFormatter={(label) => chartData.find((d) => d.name === label)?.data || label}
                />
                <Bar dataKey="consultas" fill="#FFA500" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
