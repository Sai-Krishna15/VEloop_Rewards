import React, { useState, useEffect } from 'react';
import { Flame, CheckCheck, Clock } from 'lucide-react';
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
      const now = Date.now();
      const diff = nextClaimTime - now;
      if (diff <= 0) {
        setTimeLeft('Ready Now!');
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [streak?.nextClaimAt]);

  if (!streak) return null;

  const isReady = timeLeft === 'Ready Now!';

  return (
    <div className={`glass-panel ${styles.statsContainer}`}>
      {/* Current Streak */}
      <div className={styles.statCard}>
        <div className={styles.statValue}>
          <Flame size={20} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.7))' }} />
          {streak.currentStreak}
        </div>
        <div className={styles.statLabel}>Current Streak</div>
      </div>

      {/* Checked In */}
      <div className={styles.statCard}>
        <div className={styles.statValue}>
          <CheckCheck size={20} color="#10b981" />
          {streak.checkedIn}/{streak.totalRewards}
        </div>
        <div className={styles.statLabel}>Checked In</div>
      </div>

      {/* Countdown */}
      <div className={styles.statCard}>
        <div
          className={styles.statValue}
          style={{
            fontSize: isReady ? '1.1rem' : '1.2rem',
            color: isReady ? 'var(--color-success)' : '#fff',
          }}
        >
          {!isReady && <Clock size={16} color="var(--color-text-muted)" />}
          {timeLeft}
        </div>
        <div className={styles.statLabel}>Next Reward</div>
      </div>
    </div>
  );
}
