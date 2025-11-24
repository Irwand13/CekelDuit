import { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, Target, AlertCircle } from 'lucide-react';
import { calculateBalance, getTransactions, getUserProfile } from '../lib/storage';
import { formatCurrency, formatShortDate } from '../lib/utils';
import { getRandomQuote } from '../lib/quotes';
import { getCategoryIcon } from '../lib/categories';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { NgiritModeAlert } from './NgiritModeAlert';

interface HomeProps {
  onNavigate: (page: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [dailyQuote, setDailyQuote] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentBalance = calculateBalance();
    setBalance(currentBalance);
    
    const transactions = getTransactions();
    setRecentTransactions(transactions.slice(-5).reverse());
    
    const userProfile = getUserProfile();
    setProfile(userProfile);
    setDailyQuote(getRandomQuote(userProfile.language));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <NgiritModeAlert />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-green-400 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-green-50">Halo,</p>
            <h2 className="text-white">{profile.name} 👋</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Balance Card */}
        <Card className="p-6 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 mb-1">Saldo Cekel Wallet</p>
              <div className="flex items-center gap-3">
                {showBalance ? (
                  <h1 className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(balance)}
                  </h1>
                ) : (
                  <h1 className="text-gray-400">Rp ••••••</h1>
                )}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onNavigate('transaksi')}
              className="bg-green-600 hover:bg-green-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Catat Masuk
            </Button>
            <Button
              onClick={() => onNavigate('transaksi')}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Catat Keluar
            </Button>
          </div>
        </Card>
      </div>

      {/* Daily Quote */}
      <div className="px-6 -mt-8 mb-6">
        <Card className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <div className="text-2xl">✨</div>
            <div className="flex-1">
              <p className="text-yellow-900">{dailyQuote}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Menu */}
      <div className="px-6 mb-6">
        <h3 className="mb-3">Menu Cepat</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('celengan')}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Celengan Cekel</p>
                <p className="text-gray-900">Target Nabung</p>
              </div>
            </div>
          </Card>
          
          <Card
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('laporan')}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Lihat Laporan</p>
                <p className="text-gray-900">Analisis Keuangan</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h3>Transaksi Terakhir</h3>
          <button
            onClick={() => onNavigate('transaksi')}
            className="text-green-600 text-sm"
          >
            Lihat Semua
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-400">Belum ada transaksi</p>
            <p className="text-gray-400 text-sm mt-1">Yuk mulai catat keuanganmu!</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      transaction.type === 'masuk' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getCategoryIcon(transaction.category, transaction.type)}
                    </div>
                    <div>
                      <p className="text-gray-900">{transaction.note || transaction.category}</p>
                      <p className="text-gray-400 text-sm">{formatShortDate(transaction.date)}</p>
                    </div>
                  </div>
                  <p className={transaction.type === 'masuk' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'masuk' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
