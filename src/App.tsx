import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './components/Home';
import { TransaksiPage } from './components/TransaksiPage';
import { CelenganPage } from './components/CelenganPage';
import { LaporanPage } from './components/LaporanPage';
import { ProfilPage } from './components/ProfilPage';
import { Toaster } from './components/ui/sonner';

type Page = 'splash' | 'home' | 'transaksi' | 'celengan' | 'laporan' | 'profil';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'transaksi':
        return <TransaksiPage onNavigate={setCurrentPage} />;
      case 'celengan':
        return <CelenganPage onNavigate={setCurrentPage} />;
      case 'laporan':
        return <LaporanPage onNavigate={setCurrentPage} />;
      case 'profil':
        return <ProfilPage onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <Toaster position="top-center" />
    </div>
  );
}