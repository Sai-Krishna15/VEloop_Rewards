import React from 'react';
import styles from './DailyStreak.module.css';

export default function HeroBanner() {
  return (
    <div className={styles.heroBanner}>
      <h1 className={styles.heroTitle}>Daily Streak</h1>
      <p className={styles.heroSubtitle}>Come back every day to unlock bigger rewards!</p>
    </div>
  );
}
