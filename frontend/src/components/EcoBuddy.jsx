import React, { useState, useEffect } from 'react';
import './EcoBuddy.css';

const EcoBuddy = () => {
  const [currentFact, setCurrentFact] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [expression, setExpression] = useState('happy');
  const [showFactBubble, setShowFactBubble] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Environmental facts database
  const environmentalFacts = [
    "🌍 Did you know? The Amazon rainforest produces 20% of the world's oxygen!",
    "♻️ Recycling one aluminum can saves enough energy to power a TV for 3 hours!",
    "🐝 Bees pollinate 1/3 of all the food we eat. Save the bees, save our food!",
    "💧 A dripping tap can waste over 3,000 gallons of water per year!",
    "🌳 One large tree can provide oxygen for 2 people for an entire day!",
    "🚗 Walking or biking for short trips can reduce CO2 emissions by 67%!",
    "🌊 Ocean plastic pollution kills over 1 million seabirds annually!",
    "☀️ Solar energy from just 1 hour of sunlight could power the world for a year!",
    "🦋 Butterflies taste with their feet and smell with their antennae!",
    "🌿 Bamboo grows so fast you can literally watch it grow - up to 3 feet in 24 hours!",
    "🐧 Penguins have a gland that filters salt from seawater!",
    "🌋 Volcanic eruptions can actually help cool the planet temporarily!",
    "🦎 Geckos can walk on walls because of millions of tiny hairs on their feet!",
    "🌙 Planting trees in cities can reduce temperatures by up to 9°F!",
    "🐋 Blue whales' hearts are so big, a small child could crawl through their arteries!",
    "🌸 Some flowers can change color based on soil pH levels!",
    "🦅 Eagles can see 4-8 times better than humans!",
    "🌊 The ocean produces more oxygen than all forests combined!",
    "🐸 Frogs absorb water through their skin instead of drinking it!",
    "🌟 LED bulbs use 75% less energy than traditional incandescent bulbs!",
    "🦋 Monarch butterflies migrate up to 3,000 miles - that's like flying from New York to London!",
    "🌱 A single tree can absorb 48 pounds of CO2 per year!",
    "🐨 Koalas sleep 18-22 hours a day to conserve energy!",
    "🌈 Rainbows can only be seen when the sun is behind you!",
    "🦜 Parrots are one of the few animals that can learn human language!"
  ];

  // Character expressions based on interaction
  const expressions = {
    happy: '😊',
    excited: '🤩',
    thinking: '🤔',
    surprised: '😲',
    winking: '😉'
  };

  // Handle buddy click
  const handleBuddyClick = () => {
    setIsAnimating(true);
    setClickCount(prev => prev + 1);
    
    // Random fact selection
    const randomFact = environmentalFacts[Math.floor(Math.random() * environmentalFacts.length)];
    setCurrentFact(randomFact);
    
    // Random expression
    const expressionKeys = Object.keys(expressions);
    const randomExpression = expressionKeys[Math.floor(Math.random() * expressionKeys.length)];
    setExpression(randomExpression);
    
    // Show fact bubble
    setShowFactBubble(true);
    
    // Reset animation after delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
    
    // Hide fact bubble after reading time
    setTimeout(() => {
      setShowFactBubble(false);
    }, 8000);
  };

  // Idle animations
  useEffect(() => {
    const idleInterval = setInterval(() => {
      if (!isAnimating && !showFactBubble) {
        setExpression('happy');
      }
    }, 5000);

    return () => clearInterval(idleInterval);
  }, [isAnimating, showFactBubble]);

  // Periodic blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isAnimating && !showFactBubble) {
        setExpression('winking');
        setTimeout(() => setExpression('happy'), 200);
      }
    }, 8000);

    return () => clearInterval(blinkInterval);
  }, [isAnimating, showFactBubble]);

  return (
    <div className="eco-buddy-container">
      {/* Fact bubble */}
      {showFactBubble && (
        <div className="fact-bubble">
          <div className="bubble-content">
            {currentFact}
          </div>
          <div className="bubble-tail"></div>
        </div>
      )}
      
      {/* Eco Buddy Character */}
      <div 
        className={`eco-buddy ${isAnimating ? 'bouncing' : ''}`}
        onClick={handleBuddyClick}
        title="Click me for environmental facts!"
      >
        <div className="buddy-body">
          <div className="buddy-face">
            <span className="buddy-expression">{expressions[expression]}</span>
          </div>
          <div className="buddy-leaves">
            <span className="leaf leaf-1">🍃</span>
            <span className="leaf leaf-2">🌿</span>
          </div>
        </div>
        
        {/* Interaction hint */}
        {!showFactBubble && clickCount === 0 && (
          <div className="interaction-hint">
            <span>Click me! 👆</span>
          </div>
        )}
        
        {/* Click counter */}
        {clickCount > 0 && (
          <div className="click-counter">
            Facts shared: {clickCount}
          </div>
        )}
      </div>
      
      {/* Floating particles */}
      <div className="floating-particles">
        <span className="particle particle-1">✨</span>
        <span className="particle particle-2">🌟</span>
        <span className="particle particle-3">💚</span>
        <span className="particle particle-4">🌱</span>
      </div>
      
      {/* Achievement badges */}
      {clickCount >= 5 && (
        <div className="achievement-badge curious">
          🤓 Curious Learner
        </div>
      )}
      {clickCount >= 15 && (
        <div className="achievement-badge explorer">
          🌍 Eco Explorer
        </div>
      )}
      {clickCount >= 25 && (
        <div className="achievement-badge master">
          🏆 Fact Master
        </div>
      )}
    </div>
  );
};

export default EcoBuddy;
