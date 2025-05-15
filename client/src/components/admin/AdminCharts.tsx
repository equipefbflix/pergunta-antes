import { useState } from "react";
import { useGlassmorphism } from "@/hooks/useGlassmorphism";
import { chartData } from "@/mocks/data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

export function AdminCharts() {
  const glassStyles = useGlassmorphism();
  const [activeChart, setActiveChart] = useState("all");
  
  // Colors for charts
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  const barChartFormatter = (value: number) => `${value} un.`;
  const lineChartFormatter = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;
  const customTooltipFormatter = (value: number, name: string) => [`${value}%`, name];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Bar Chart: Top Products */}
      <div className={`${glassStyles.className} rounded-xl p-6`}>
        <h3 className="text-lg font-semibold text-white mb-4">Produtos Mais Vendidos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#ccc' }} angle={-45} textAnchor="end" height={70} />
              <YAxis stroke="#666" tick={{ fill: '#ccc' }} tickFormatter={barChartFormatter} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                formatter={(value: any) => [`${value} unidades`, 'Vendas']}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]}>
                {chartData.topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Line Chart: Revenue */}
      <div className={`${glassStyles.className} rounded-xl p-6`}>
        <h3 className="text-lg font-semibold text-white mb-4">Faturamento Diário</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.dailyRevenue}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" tick={{ fill: '#ccc' }} />
              <YAxis stroke="#666" tick={{ fill: '#ccc' }} tickFormatter={lineChartFormatter} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
                labelStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#ef4444', strokeWidth: 0, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Pie Chart: Product Distribution */}
      <div className={`${glassStyles.className} rounded-xl p-6`}>
        <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Produtos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                formatter={customTooltipFormatter}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Area Chart: Balance Growth */}
      <div className={`${glassStyles.className} rounded-xl p-6`}>
        <h3 className="text-lg font-semibold text-white mb-4">Crescimento de Saldo na Plataforma</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData.balanceGrowth}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#ccc' }} />
              <YAxis stroke="#666" tick={{ fill: '#ccc' }} tickFormatter={lineChartFormatter} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo Total']}
                labelStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Bar Chart: Conversion Rates */}
      <div className={`${glassStyles.className} rounded-xl p-6`}>
        <h3 className="text-lg font-semibold text-white mb-4">Taxa de Conversão por Produto</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.conversionRates}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#666" 
                tick={{ fill: '#ccc' }} 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`} 
              />
              <YAxis 
                dataKey="product" 
                type="category" 
                stroke="#666" 
                tick={{ fill: '#ccc' }} 
                width={120} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                formatter={(value: any) => [`${value}%`, 'Taxa de conversão']}
                labelStyle={{ color: '#fff' }}
              />
              <Bar 
                dataKey="rate" 
                radius={[0, 4, 4, 0]} 
                maxBarSize={20}
              >
                {chartData.conversionRates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminCharts;