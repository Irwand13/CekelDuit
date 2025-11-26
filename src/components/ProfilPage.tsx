import { useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { ArrowLeft, User, Bell, Globe, Trash2, Download } from 'lucide-react';
import { getUserProfile, saveUserProfile, calculateBalance, getTransactions, getSavingsTargets } from '../lib/storage';
import { formatCurrency } from '../lib/utils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface ProfilPageProps {
  onNavigate: (page: any) => void;
}

export function ProfilPage({ onNavigate }: ProfilPageProps) {
  const [profile, setProfile] = useState(getUserProfile());
  const [name, setName] = useState(profile.name);
  const [language, setLanguage] = useState(profile.language);
  const [ngiritMode, setNgiritMode] = useState(profile.ngiritMode);

  const handleSaveProfile = () => {
    const updatedProfile = {
      name,
      language,
      ngiritMode,
    };
    
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    toast.success('Profil berhasil disimpan! ✅');
  };

  const handleExportData = () => {
    const data = {
      profile: getUserProfile(),
      transactions: getTransactions(),
      savings: getSavingsTargets(),
      balance: calculateBalance(),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cekelduit-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data berhasil diexport! 📥');
  };

  const handleClearData = () => {
    if (confirm('⚠️ PERHATIAN!\n\nSemua data transaksi dan tabungan akan dihapus permanen. Pastikan kamu sudah backup data!\n\nLanjutkan?')) {
      if (confirm('Yakin banget? Data tidak bisa dikembalikan!')) {
        localStorage.clear();
        toast.success('Semua data berhasil dihapus');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const balance = calculateBalance();
  const totalTransactions = getTransactions().length;
  const totalTargets = getSavingsTargets().length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-400 px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white flex-1">Profil & Pengaturan</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-white">{profile.name}</h3>
            <p className="text-purple-100 text-sm">Team Jirolupat</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-8 mb-6">
        <Card className="p-4">
          <div className="grid grid-cols-3 divide-x">
            <div className="text-center px-2">
              <p className="text-gray-500 text-sm mb-1">Saldo</p>
              <p className={`${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-gray-500 text-sm mb-1">Transaksi</p>
              <p className="text-gray-900">{totalTransactions}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-gray-500 text-sm mb-1">Target</p>
              <p className="text-gray-900">{totalTargets}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="px-6 space-y-4">
        <Card className="p-5">
          <h3 className="mb-4">Informasi Pribadi</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
              />
            </div>

            <div>
              <Label htmlFor="language">Bahasa</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                  <SelectItem value="jv">☕ Jawa (Malang)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveProfile} className="w-full bg-purple-600 hover:bg-purple-700">
              Simpan Perubahan
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4">Preferensi</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-900">Mode Ngirit</p>
                <p className="text-gray-500 text-sm">Pengingat agar tidak boros</p>
              </div>
            </div>
            <Switch
              checked={ngiritMode}
              onCheckedChange={(checked) => {
                setNgiritMode(checked);
                const updatedProfile = { ...profile, ngiritMode: checked };
                saveUserProfile(updatedProfile);
                setProfile(updatedProfile);
                toast.success(checked ? 'Mode Ngirit diaktifkan! 💪' : 'Mode Ngirit dinonaktifkan');
              }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4">Data & Backup</h3>
          
          <div className="space-y-3">
            <Button 
              onClick={handleExportData}
              variant="outline" 
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-3" />
              Export Data (Backup)
            </Button>

            <Button 
              onClick={handleClearData}
              variant="outline" 
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Hapus Semua Data
            </Button>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 border-green-200">
          <div className="text-center">
            <div className="text-4xl mb-3">💚</div>
            <h3 className="text-green-900 mb-2">CekelDuit</h3>
            <p className="text-green-800 text-sm mb-3">
              Aplikasi pengelola keuangan pribadi berbasis mobile
            </p>
            <p className="text-green-700 text-xs">
              Cekel Duitmu, Wujudkan Impianmu! ✨
            </p>
          </div>
        </Card>
      </div>

      <BottomNav currentPage="profil" onNavigate={onNavigate} />
    </div>
  );
}
