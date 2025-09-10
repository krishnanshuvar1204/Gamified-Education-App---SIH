import React from 'react';
import './LevelUpModal.css';

const LevelUpModal = ({ isOpen, onClose, oldLevel, newLevel, newRank }) => {
  if (!isOpen) return null;

  return (
    <div className="level-up-modal-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="level-up-content">
          <div className="level-up-header">
            <h2 className="level-up-title">🎉 LEVEL UP! 🎉</h2>
          </div>
          
          <div className="level-up-animation">
            <div className="old-level">
              Level {oldLevel}
            </div>
            <div className="level-arrow">→</div>
            <div className="new-level">
              Level {newLevel}
            </div>
          </div>
          
          <div className="new-rank">
            <div className="rank-label">You are now a</div>
            <div className="rank-name">{newRank}</div>
          </div>
          
          <div className="level-up-effects">
            <div className="confetti">🎊</div>
            <div className="stars">⭐✨🌟✨⭐</div>
          </div>
          
          <button className="level-up-close-btn" onClick={onClose}>
            Continue Your Journey!
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
