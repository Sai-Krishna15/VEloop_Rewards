import React, { useState, useEffect } from 'react';
import styles from './DailyStreak.module.css';

export default function StreakStats({ streak }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!streak?.nextClaimAt) {
      setTimeLeft('Ready Now!');
      return;
    }

    const nextClaimTime = new Date(streak.nextClaimAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = nextClaimTime - now;

      if (diff <= 0) {
        setTimeLeft('Ready Now!');
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [streak?.nextClaimAt]);

  if (!streak) return null;

  return (
    <div className={`glass-panel ${styles.statsContainer}`}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{streak.currentStreak}</div>
        <div className={styles.statLabel}>Current Streak</div>
      </div>
      <div className={styles.statCard} style={{ borderLeft: '1px solid var(--ui-glass-border)', borderRight: '1px solid var(--ui-glass-border)' }}>
        <div className={styles.statValue}>{streak.checkedIn}/{streak.totalRewards}</div>
        <div className={styles.statLabel}>Checked In</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statValue} style={{ fontSize: '1.25rem', color: timeLeft === 'Ready Now!' ? 'var(--color-success)' : 'inherit' }}>
          {timeLeft}
        </div>
        <div className={styles.statLabel}>Next Reward</div>
      </div>
    </div>
  );
}
