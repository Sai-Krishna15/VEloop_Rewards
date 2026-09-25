import React from 'react';
import styles from './DailyStreak.module.css';

export default function StreakHeader({ wallet, onLogout }) {
  // Fallback to 0 if wallet data is missing
  const vesBalance = wallet?.vesBalance || 0;

  return (
    <header className={styles.header}>
      <button className={styles.backBtn} onClick={onLogout} aria-label="Logout" style={{ fontSize: '1rem' }}>
        Logout
      </button>
      <div className={styles.walletBadge} title="Wallet Balance">
        <span className={styles.gemIcon}>💎</span>
        <span>{vesBalance} VEs</span>
      </div>
    </header>
  );
}
