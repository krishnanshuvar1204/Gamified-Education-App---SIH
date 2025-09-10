import React, { useState, useEffect } from 'react';
import './VirtualGarden.css';

const VirtualGarden = ({ user }) => {
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [showPlantAnimation, setShowPlantAnimation] = useState(false);

  // Calculate trees based on XP (1 tree per 100 XP)
  useEffect(() => {
    const currentXP = user?.xp || user?.levelInfo?.totalXP || 0;
    const newTreeCount = Math.floor(currentXP / 100);
    
    if (newTreeCount > treesPlanted) {
      setShowPlantAnimation(true);
      setTimeout(() => setShowPlantAnimation(false), 2000);
    }
    
    setTreesPlanted(newTreeCount);
  }, [user?.xp, user?.levelInfo?.totalXP, treesPlanted]);

  // Generate tree positions for a natural garden layout
  const generateTreePositions = (count) => {
    const positions = [];
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      // Add some randomness for natural look
      const x = (col * 80) + (Math.random() * 20 - 10) + 40;
      const y = (row * 80) + (Math.random() * 20 - 10) + 60;
      
      positions.push({ x, y, id: i });
    }
    
    return positions;
  };

  const treePositions = generateTreePositions(treesPlanted);
  const currentXP = user?.xp || user?.levelInfo?.totalXP || 0;
  const xpToNextTree = 100 - (currentXP % 100);

  return (
    <div className="virtual-garden">
      <div className="garden-header">
        <h3>🌳 Your Virtual Garden</h3>
        <div className="garden-stats">
          <span className="trees-count">🌲 {treesPlanted} Trees Planted</span>
          <span className="next-tree">Next tree in {xpToNextTree} XP</span>
        </div>
      </div>
      
      <div className="garden-container">
        <div className="garden-ground">
          {/* Garden background with grass pattern */}
          <div className="grass-pattern"></div>
          
          {/* Planted trees */}
          {treePositions.map((pos, index) => (
            <div
              key={pos.id}
              className={`tree ${showPlantAnimation && index === treesPlanted - 1 ? 'planting' : ''}`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`
              }}
            >
              {/* Different tree types based on position */}
              <span className="tree-emoji">
                {index % 4 === 0 ? '🌳' : 
                 index % 4 === 1 ? '🌲' : 
                 index % 4 === 2 ? '🌴' : '🎋'}
              </span>
            </div>
          ))}
          
          {/* Empty spots for future trees */}
          {treesPlanted < 20 && (
            <div className="empty-spots">
              {Array.from({ length: Math.min(5, 20 - treesPlanted) }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="empty-spot"
                  style={{
                    left: `${((treesPlanted + index) % 5) * 80 + 40}px`,
                    top: `${Math.floor((treesPlanted + index) / 5) * 80 + 60}px`
                  }}
                >
                  <span className="spot-marker">⭕</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Garden decorations */}
          <div className="garden-decorations">
            <div className="flower flower-1">🌸</div>
            <div className="flower flower-2">🌺</div>
            <div className="flower flower-3">🌻</div>
            <div className="butterfly">🦋</div>
          </div>
        </div>
        
        {/* Progress bar for next tree */}
        <div className="next-tree-progress">
          <div className="progress-label">Progress to next tree:</div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentXP % 100) / 100) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">{currentXP % 100}/100 XP</div>
        </div>
      </div>
      
      {/* Planting animation overlay */}
      {showPlantAnimation && (
        <div className="planting-animation">
          <div className="celebration-text">🌱 New Tree Planted! 🌱</div>
          <div className="sparkles">
            <span>✨</span>
            <span>🌟</span>
            <span>✨</span>
            <span>🌟</span>
            <span>✨</span>
          </div>
        </div>
      )}
      
      {/* Garden achievements */}
      {treesPlanted > 0 && (
        <div className="garden-achievements">
          {treesPlanted >= 1 && <div className="achievement">🌱 First Sprout</div>}
          {treesPlanted >= 5 && <div className="achievement">🌳 Small Grove</div>}
          {treesPlanted >= 10 && <div className="achievement">🏞️ Mini Forest</div>}
          {treesPlanted >= 20 && <div className="achievement">🌲 Forest Guardian</div>}
        </div>
      )}
    </div>
  );
};

export default VirtualGarden;
