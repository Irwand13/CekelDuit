import { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { getTransactions, saveTransaction, deleteTransaction, getUserProfile } from '../lib/storage';
import { formatCurrency, formatDate } from '../lib/utils';
import { getCategoryIcon, getCategoryLabel, expenseCategories, incomeCategories } from '../lib/categories';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Transaction } from '../types';
import { getRandomNgiritMessage } from '../lib/quotes';
import { toast } from 'sonner@2.0.3';

interface TransaksiPageProps {
  onNavigate: (page: any) => void;
}

export function TransaksiPage({ onNavigate }: TransaksiPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<'masuk' | 'keluar'>('keluar');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const profile = getUserProfile();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const data = getTransactions();
    setTransactions(data.reverse());
  };

  const handleAddTransaction = () => {
    if (!amount || !category) {
      toast.error('Mohon isi jumlah dan kategori!');
      return;
    }

    // Show ngirit mode alert if enabled and it's an expense
    if (profile.ngiritMode && transactionType === 'keluar' && parseFloat(amount) > 50000) {
      const message = getRandomNgiritMessage(profile.language);
      toast.warning(message, {
        duration: 4000,
      });
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(amount),
      category,
      date,
      note: note || category,
    };

    saveTransaction(newTransaction);
    loadTransactions();
    
    // Reset form
    setAmount('');
    setCategory('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddDialog(false);
    
    toast.success('Transaksi berhasil dicatat! 🎉');
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Yakin mau hapus transaksi ini?')) {
      deleteTransaction(id);
      loadTransactions();
      toast.success('Transaksi berhasil dihapus');
    }
  };

  const categories = transactionType === 'masuk' ? incomeCategories : expenseCategories;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1">Daftar Transaksi</h2>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-green-600 hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Catat Transaksi Baru</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as any)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="masuk" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      Pemasukan
                    </TabsTrigger>
                    <TabsTrigger value="keluar" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                      Pengeluaran
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div>
                  <Label htmlFor="amount">Jumlah (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="note">Catatan</Label>
                  <Input
                    id="note"
                    placeholder="Opsional"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddTransaction}
                  className={`w-full ${
                    transactionType === 'masuk' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Simpan Transaksi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-6 py-6">
        {transactions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="mb-2">Belum Ada Transaksi</h3>
            <p className="text-gray-500 mb-4">Mulai catat pemasukan dan pengeluaranmu yuk!</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Transaksi
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      transaction.type === 'masuk' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getCategoryIcon(transaction.category, transaction.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{transaction.note}</p>
                      <p className="text-gray-400 text-sm">
                        {getCategoryLabel(transaction.category, transaction.type)}
                      </p>
                      <p className="text-gray-400 text-sm">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className={`${transaction.type === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'masuk' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav currentPage="transaksi" onNavigate={onNavigate} />
    </div>
  );
}
