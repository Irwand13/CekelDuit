export const expenseCategories = [
  { value: 'makan', label: 'Makan & Minum', icon: '🍜' },
  { value: 'bensin', label: 'Bensin & Transportasi', icon: '⛽' },
  { value: 'hiburan', label: 'Hiburan', icon: '🎮' },
  { value: 'belanja', label: 'Belanja', icon: '🛒' },
  { value: 'tagihan', label: 'Tagihan & Utilitas', icon: '📱' },
  { value: 'kesehatan', label: 'Kesehatan', icon: '💊' },
  { value: 'pendidikan', label: 'Pendidikan', icon: '📚' },
  { value: 'lainnya', label: 'Lainnya', icon: '💸' },
];

export const incomeCategories = [
  { value: 'gaji', label: 'Gaji', icon: '💰' },
  { value: 'bonus', label: 'Bonus', icon: '🎁' },
  { value: 'usaha', label: 'Usaha Sampingan', icon: '💼' },
  { value: 'investasi', label: 'Investasi', icon: '📈' },
  { value: 'hadiah', label: 'Hadiah', icon: '🎉' },
  { value: 'lainnya', label: 'Lainnya', icon: '💵' },
];

export const getCategoryLabel = (category: string, type: 'masuk' | 'keluar'): string => {
  const categories = type === 'masuk' ? incomeCategories : expenseCategories;
  return categories.find(c => c.value === category)?.label || category;
};

export const getCategoryIcon = (category: string, type: 'masuk' | 'keluar'): string => {
  const categories = type === 'masuk' ? incomeCategories : expenseCategories;
  return categories.find(c => c.value === category)?.icon || '💸';
};
