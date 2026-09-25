import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import styles from './DailyStreak.module.css';

export default function UltimateReward({ streak }) {
  // If the user has completed the streak, show it as claimed.
  // We'll approximate this by checking if they claimed Day 7.
  // Usually, the backend would return a specific flag, but we can look at the streak state.
  // For the UI, we'll assume it's locked unless streak.status === 'COMPLETED' or they claimed Day 7.
  const isUnlocked = streak?.status === 'COMPLETED';

  return (
    <div className={styles.ultimateRewardCard}>
      <div className={styles.ultimateLeft}>
        <div className={styles.crownGlow}>
          <img src="/assets/Day-7.png" alt="Crown" className={styles.ultimateCrownImg} />
        </div>
      </div>
      
      <div className={styles.ultimateCenter}>
        <div className={styles.ultimateTitle}>Ultimate Reward</div>
        <div className={styles.ultimateAmount}>₹5</div>
        <div className={styles.ultimateSubtitle}>
          <span className={styles.amazonIcon}>a</span> Amazon Gift Card
        </div>
      </div>

      <div className={styles.ultimateRight}>
        <div className={styles.lockCircle}>
          {isUnlocked ? <CheckCircle size={20} color="var(--color-success)" /> : <Lock size={20} color="var(--color-text-muted)" />}
        </div>
        <div className={styles.unlockText}>
          {isUnlocked ? 'Unlocked!' : 'Unlock on\nDay 7'}
        </div>
      </div>
    </div>
  );
}
