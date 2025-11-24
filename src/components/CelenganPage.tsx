import { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { ArrowLeft, Plus, Trash2, Target, TrendingUp } from 'lucide-react';
import { getSavingsTargets, saveSavingsTarget, deleteSavingsTarget } from '../lib/storage';
import { formatCurrency, formatDate } from '../lib/utils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { SavingsTarget } from '../types';
import { toast } from 'sonner@2.0.3';

interface CelenganPageProps {
  onNavigate: (page: any) => void;
}

const emojiOptions = ['🏍️', '📱', '💻', '🏠', '✈️', '🎮', '👟', '🎓', '💍', '🚗'];

export function CelenganPage({ onNavigate }: CelenganPageProps) {
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<SavingsTarget | null>(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [addAmount, setAddAmount] = useState('');

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = () => {
    const data = getSavingsTargets();
    setTargets(data);
  };

  const handleAddTarget = () => {
    if (!name || !targetAmount || !deadline) {
      toast.error('Mohon isi semua data!');
      return;
    }

    const newTarget: SavingsTarget = {
      id: Date.now().toString(),
      name,
      target: parseFloat(targetAmount),
      current: 0,
      deadline,
      emoji: selectedEmoji,
    };

    saveSavingsTarget(newTarget);
    loadTargets();
    
    // Reset form
    setName('');
    setTargetAmount('');
    setDeadline('');
    setSelectedEmoji('🎯');
    setShowAddDialog(false);
    
    toast.success('Target nabung berhasil dibuat! 🎉');
  };

  const handleAddMoney = () => {
    if (!selectedTarget || !addAmount) {
      toast.error('Mohon isi jumlah uang!');
      return;
    }

    const updatedTarget = {
      ...selectedTarget,
      current: selectedTarget.current + parseFloat(addAmount),
    };

    saveSavingsTarget(updatedTarget);
    loadTargets();
    
    setAddAmount('');
    setShowAddMoneyDialog(false);
    setSelectedTarget(null);
    
    toast.success('Uang berhasil ditambahkan! 💰');
  };

  const handleDeleteTarget = (id: string) => {
    if (confirm('Yakin mau hapus target nabung ini?')) {
      deleteSavingsTarget(id);
      loadTargets();
      toast.success('Target berhasil dihapus');
    }
  };

  const getProgress = (target: SavingsTarget) => {
    return Math.min((target.current / target.target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-300 px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-yellow-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-yellow-900 flex-1">Celengan Cekel</h2>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white text-yellow-600 hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Target Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Target Nabung Baru</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Pilih Icon</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-12 h-12 text-2xl rounded-lg border-2 transition-colors ${
                          selectedEmoji === emoji
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Nama Target</Label>
                  <Input
                    id="name"
                    placeholder="Misal: Beli Motor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="target">Target Uang (Rp)</Label>
                  <Input
                    id="target"
                    type="number"
                    placeholder="0"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Target Waktu</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddTarget}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                >
                  Buat Target
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-yellow-900/80">Ayo wujudkan impianmu dengan nabung! 💪</p>
      </div>

      {/* Targets List */}
      <div className="px-6 py-6">
        {targets.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🐷</div>
            <h3 className="mb-2">Belum Ada Target Nabung</h3>
            <p className="text-gray-500 mb-4">Yuk buat target nabung untuk impianmu!</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              <Plus className="w-4 h-4 mr-2" />
              Buat Target Baru
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {targets.map((target) => {
              const progress = getProgress(target);
              const isCompleted = progress >= 100;
              
              return (
                <Card key={target.id} className={`p-5 ${isCompleted ? 'border-2 border-green-500 bg-green-50' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-4xl">{target.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-gray-900">{target.name}</h3>
                          {isCompleted && <span className="text-2xl">🎉</span>}
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          Target: {formatDate(target.deadline)}
                        </p>
                        
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                              {formatCurrency(target.current)} / {formatCurrency(target.target)}
                            </p>
                            <p className="text-yellow-600">
                              {progress.toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTarget(target);
                        setShowAddMoneyDialog(true);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isCompleted}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {isCompleted ? 'Target Tercapai!' : 'Tambah Uang'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTarget(target.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Uang ke Celengan</DialogTitle>
          </DialogHeader>
          
          {selectedTarget && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedTarget.emoji}</span>
                  <h3>{selectedTarget.name}</h3>
                </div>
                <p className="text-gray-600">
                  Terkumpul: {formatCurrency(selectedTarget.current)} / {formatCurrency(selectedTarget.target)}
                </p>
              </div>

              <div>
                <Label htmlFor="addAmount">Jumlah Uang (Rp)</Label>
                <Input
                  id="addAmount"
                  type="number"
                  placeholder="0"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleAddMoney}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Tambah ke Celengan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav currentPage="celengan" onNavigate={onNavigate} />
    </div>
  );
}
