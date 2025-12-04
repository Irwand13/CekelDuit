import { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getTransactions, calculateBalance } from '../lib/storage';
import { formatCurrency } from '../lib/utils';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { expenseCategories } from '../lib/categories';

interface LaporanPageProps {
  onNavigate: (page: any) => void;
}

export function LaporanPage({ onNavigate }: LaporanPageProps) {
  const [period, setPeriod] = useState<'week' | 'month'>('month');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);

  useEffect(() => {
    calculateReport();
  }, [period]);

  const calculateReport = () => {
    const transactions = getTransactions();
    const now = new Date();
    const periodDays = period === 'week' ? 7 : 30;
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const periodTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate
    );

    // Calculate totals
    const income = periodTransactions
      .filter(t => t.type === 'masuk')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = periodTransactions
      .filter(t => t.type === 'keluar')
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);

    // Category breakdown
    const categoryMap = new Map();
    periodTransactions
      .filter(t => t.type === 'keluar')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const catData = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: expenseCategories.find(c => c.value === category)?.label || category,
      value: amount,
    }));

    setCategoryData(catData);

    // Daily data for bar chart
    const dailyMap = new Map();
    for (let i = 0; i < periodDays; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, { date: dateStr, masuk: 0, keluar: 0 });
    }

    periodTransactions.forEach(t => {
      const dateStr = t.date;
      if (dailyMap.has(dateStr)) {
        const day = dailyMap.get(dateStr);
        if (t.type === 'masuk') {
          day.masuk += t.amount;
        } else {
          day.keluar += t.amount;
        }
      }
    });

    const daily = Array.from(dailyMap.values()).reverse();
    setDailyData(daily);
  };

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const balance = calculateBalance();
  const savings = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1">Laporan Keuangan</h2>
        </div>
        
        <p className="text-blue-50">Ayo analisis keuanganmu secara detail</p>
      </div>

      {/* Period Selector */}
      <div className="px-6 -mt-3 mb-6">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">Minggu Ini</TabsTrigger>
            <TabsTrigger value="month">Bulan Ini</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-green-900 text-sm">Pemasukan</p>
            </div>
            <p className="text-green-700">{formatCurrency(totalIncome)}</p>
          </Card>

          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <p className="text-red-900 text-sm">Pengeluaran</p>
            </div>
            <p className="text-red-700">{formatCurrency(totalExpense)}</p>
          </Card>
        </div>

        <Card className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-900 mb-1">Selisih Periode Ini</p>
              <p className={`${savings >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(savings)}
              </p>
            </div>
            <div className="text-4xl">
              {savings >= 0 ? '🎉' : '😅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="px-6 space-y-4">
        {/* Daily Trend */}
        <Card className="p-4">
          <h3 className="mb-4">Tren Harian</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('id-ID');
                }}
              />
              <Legend />
              <Bar dataKey="masuk" fill="#10b981" name="Masuk" />
              <Bar dataKey="keluar" fill="#ef4444" name="Keluar" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <Card className="p-4">
            <h3 className="mb-4">Pengeluaran per Kategori</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <p className="text-gray-700 text-sm">{cat.name}</p>
                  </div>
                  <p className="text-gray-900">{formatCurrency(cat.value)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="text-blue-900 mb-3">💡 Insight & Rekomendasi</h3>
          <div className="space-y-2">
            {savings >= 0 ? (
              <>
                <p className="text-blue-800 text-sm">
                  ✅ Keren! Kamu berhasil menabung {formatCurrency(savings)} periode ini!
                </p>
                <p className="text-blue-800 text-sm">
                  💪 Pertahankan kebiasaan baikmu dan terus tingkatkan!
                </p>
              </>
            ) : (
              <>
                <p className="text-blue-800 text-sm">
                  ⚠️ Pengeluaranmu melebihi pemasukan sebesar {formatCurrency(Math.abs(savings))}.
                </p>
                <p className="text-blue-800 text-sm">
                  💡 Coba kurangi pengeluaran di kategori terbesar atau tingkatkan pemasukan ya!
                </p>
              </>
            )}
            {categoryData.length > 0 && (
              <p className="text-blue-800 text-sm">
                📊 Pengeluaran terbesarmu: {categoryData[0].name} ({formatCurrency(categoryData[0].value)})
              </p>
            )}
          </div>
        </Card>
      </div>

      <BottomNav currentPage="laporan" onNavigate={onNavigate} />
    </div>
  );
}
