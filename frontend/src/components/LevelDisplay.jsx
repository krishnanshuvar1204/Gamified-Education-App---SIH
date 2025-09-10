import React from 'react';
import './LevelDisplay.css';

const LevelDisplay = ({ user, showProgress = true, size = 'medium' }) => {
  if (!user || !user.levelInfo) {
    return null;
  }

  const { levelInfo } = user;
  const {
    currentLevel,
    currentRank,
    currentLevelColor,
    currentLevelXP,
    nextLevelXP,
    progressPercent,
    xpToNextLevel,
    nextRank,
    totalXP
  } = levelInfo;

  const sizeClasses = {
    small: 'level-display-small',
    medium: 'level-display-medium',
    large: 'level-display-large'
  };

  return (
    <div className={`level-display ${sizeClasses[size]}`}>
      <div className="level-header">
        <div className="level-rank" style={{ color: currentLevelColor }}>
          {currentRank}
        </div>
        <div className="level-number">
          Level {currentLevel}
        </div>
      </div>
      
      {showProgress && (
        <div className="level-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: currentLevelColor 
              }}
            />
          </div>
          <div className="progress-text">
            <span className="current-xp">{currentLevelXP}</span>
            <span className="separator">/</span>
            <span className="next-level-xp">{nextLevelXP}</span>
            <span className="xp-label">XP</span>
          </div>
          {xpToNextLevel > 0 && (
            <div className="next-level-info">
              <span className="xp-to-next">{xpToNextLevel} XP to {nextRank}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="total-xp">
        Total: {totalXP} XP
      </div>
    </div>
  );
};

export default LevelDisplay;
