import React, { useEffect, useState } from 'react';
import { getStreak, register, login } from '../../services/streakApi';
import styles from './DailyStreak.module.css';

// Subcomponents (we will create these next)
import StreakHeader from './StreakHeader';
import HeroBanner from './HeroBanner';
import StreakStats from './StreakStats';
import UltimateReward from './UltimateReward';
import RewardGrid from './RewardGrid';
import StreakSkeleton from './StreakSkeleton';
import WhyStreak from './WhyStreak';
import TrustFooter from './TrustFooter';

export default function DailyStreakPage({ onLogout }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        // Fetch streak state directly, token is handled by App
        const state = await getStreak();
        setData(state);
      } catch (err) {
        console.error('Failed to initialize streak page:', err);
        if (err.response?.status === 401) {
          onLogout();
        } else {
          setError('Unable to load Daily Streak. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [onLogout]);

  if (loading) {
    return (
      <div className={styles.container}>
        <StreakSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <StreakHeader wallet={data.wallet} onLogout={onLogout} />
        <HeroBanner />
        <StreakStats streak={data.streak} />
        <UltimateReward streak={data.streak} />
        <RewardGrid 
          rewards={data.rewards} 
          streak={data.streak} 
          serverTime={data.serverTime} 
          onStateRefresh={setData} 
        />
        <WhyStreak />
      </div>
      <TrustFooter />
    </div>
  );
}
