import React from 'react';
import { ChevronLeft } from 'lucide-react';
import styles from './DailyStreak.module.css';

export default function StreakHeader({ wallet, onLogout }) {
  // Fallback to 0 if wallet data is missing
  const vesBalance = wallet?.vesBalance || 0;

  return (
    <header className={styles.header}>
      <button className={styles.backBtn} onClick={onLogout} aria-label="Go Back">
        LogOut
      </button>

      <div className={styles.headerTitleContainer}>
        <h2 className={styles.headerTitle}>Daily Streak</h2>
        <img src="/assets/Flame.png" alt="Flame" className={styles.headerFlame} />
      </div>

      <div className={styles.walletBadge} title="Wallet Balance">
        <img src="/assets/VEs_Coin.png" alt="VEs" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        <span>{vesBalance}</span>
      </div>
    </header>
  );
}
