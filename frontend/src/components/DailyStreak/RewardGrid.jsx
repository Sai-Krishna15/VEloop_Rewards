import React, { useState, useEffect } from 'react';
import styles from './DailyStreak.module.css';
import ClaimModal from './ClaimModal';

export default function RewardGrid({ rewards, streak, serverTime, onStateRefresh }) {
  const [claimingDay, setClaimingDay] = useState(null);
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    if (!streak?.nextClaimAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [streak?.nextClaimAt]);

  const handleClaimClick = (day) => {
    setClaimingDay(day);
  };

  const handleClaimSuccess = (newState) => {
    setClaimingDay(null);
    onStateRefresh(newState);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'GIFT_CARD': return '🎁';
      case 'crown': return '👑';
      case 'gift-box': return '📦';
      default: return '💎';
    }
  };

  return (
    <>
      <div className={styles.grid}>
        {rewards.map((r) => {
          const isToday = r.status === 'TODAY';
          const isClaimed = r.status === 'CLAIMED';
          const isLocked = r.status === 'LOCKED';
          
          let isReady = false;
          if (isToday) {
            isReady = !streak.nextClaimAt || now >= new Date(streak.nextClaimAt).getTime();
          }

          let cardClass = `${styles.rewardCard}`;
          if (isToday && isReady) cardClass += ` ${styles.today}`;
          if (isClaimed) cardClass += ` ${styles.claimed}`;
          if (isLocked || (isToday && !isReady)) cardClass += ` ${styles.locked}`;

          return (
            <div 
              key={r.day} 
              className={cardClass}
              onClick={() => { if (isToday && isReady) handleClaimClick(r.day); }}
              role={isToday && isReady ? "button" : undefined}
              tabIndex={isToday && isReady ? 0 : undefined}
            >
              {isClaimed && (
                <div className={styles.checkmark}>✓</div>
              )}
              <div className={styles.dayLabel}>Day {r.day}</div>
              <div className={styles.rewardIcon}>
                {getIcon(r.reward.assetType || r.reward.type)}
              </div>
              <div className={styles.rewardAmount}>
                {r.reward.amount > 0 ? `+${r.reward.amount}` : ''}
              </div>
            </div>
          );
        })}
      </div>

      {claimingDay !== null && (
        <ClaimModal 
          day={claimingDay} 
          onClose={() => setClaimingDay(null)}
          onSuccess={handleClaimSuccess}
        />
      )}
    </>
  );
}
