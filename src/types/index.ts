export interface Transaction {
  id: string;
  type: 'masuk' | 'keluar';
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface SavingsTarget {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  emoji: string;
}

export interface UserProfile {
  name: string;
  language: 'id' | 'jv';
  ngiritMode: boolean;
}
