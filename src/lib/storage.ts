import { Transaction, SavingsTarget, UserProfile } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'cekelduit_transactions',
  SAVINGS: 'cekelduit_savings',
  PROFILE: 'cekelduit_profile',
};

// Transactions
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const deleteTransaction = (id: string) => {
  const transactions = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Savings Targets
export const getSavingsTargets = (): SavingsTarget[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
  return data ? JSON.parse(data) : [];
};

export const saveSavingsTarget = (target: SavingsTarget) => {
  const targets = getSavingsTargets();
  const existingIndex = targets.findIndex(t => t.id === target.id);
  if (existingIndex >= 0) {
    targets[existingIndex] = target;
  } else {
    targets.push(target);
  }
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(targets));
};

export const deleteSavingsTarget = (id: string) => {
  const targets = getSavingsTargets().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(targets));
};

// User Profile
export const getUserProfile = (): UserProfile => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : { name: 'Arek Malang', language: 'id', ngiritMode: false };
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

// Calculate balance
export const calculateBalance = (): number => {
  const transactions = getTransactions();
  return transactions.reduce((total, t) => {
    return t.type === 'masuk' ? total + t.amount : total - t.amount;
  }, 0);
};
