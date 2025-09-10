import React, { useState, useEffect } from 'react';
import './XPGainAnimation.css';

const XPGainAnimation = ({ xpGained, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (xpGained > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [xpGained, onComplete]);

  if (!visible || xpGained <= 0) return null;

  return (
    <div className="xp-gain-animation">
      <div className="xp-gain-text">
        +{xpGained} XP
      </div>
      <div className="xp-gain-sparkles">
        <span className="sparkle sparkle-1">✨</span>
        <span className="sparkle sparkle-2">⭐</span>
        <span className="sparkle sparkle-3">✨</span>
      </div>
    </div>
  );
};

export default XPGainAnimation;
