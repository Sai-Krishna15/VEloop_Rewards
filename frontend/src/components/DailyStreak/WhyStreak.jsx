import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import styles from './DailyStreak.module.css';

export default function WhyStreak() {
  const benefits = [
    {
      icon: <img src="/assets/Stay_Active.png" alt="Stay Active" className={styles.benefitIcon} />,
      title: 'Stay Active',
      desc: 'Keep your streak alive & earn more every day!',
    },
    {
      icon: <img src="/assets/Bigger_Streak.png" alt="Bigger Streak" className={styles.benefitIcon} />,
      title: 'Bigger Rewards',
      desc: 'More consecutive logins, bigger rewards!',
    },
    {
      icon: <img src="/assets/Exclusive-reward.png" alt="Exclusive Rewards" className={styles.benefitIcon} />,
      title: 'Exclusive Perks',
      desc: 'Unlock coins, gift cards & special bonuses!',
    },
    {
      icon: <ShieldCheck size={28} color="var(--color-success)" />,
      title: "Don't Miss Out",
      desc: 'Come back every day & unlock all rewards!',
    },
  ];

  return (
    <div className={styles.whyStreakSection}>
      <div className={styles.whyStreakHeader}>
        <Sparkles size={16} color="var(--color-accent)" />
        <h3>Why Maintain Your Streak?</h3>
        <Sparkles size={16} color="var(--color-accent)" />
      </div>

      <div className={styles.benefitsGrid}>
        {benefits.map((b, i) => (
          <div key={i} className={styles.benefitCard}>
            <div className={styles.benefitIconWrapper}>{b.icon}</div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
