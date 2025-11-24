import { Home, PlusCircle, PiggyBank, BarChart3, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'transaksi' | 'celengan' | 'laporan' | 'profil') => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'transaksi', icon: PlusCircle, label: 'Transaksi' },
    { id: 'celengan', icon: PiggyBank, label: 'Celengan' },
    { id: 'laporan', icon: BarChart3, label: 'Laporan' },
    { id: 'profil', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-green-600' : ''}`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
