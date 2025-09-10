import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MiniGamesBar.css';

const MiniGamesBar = () => {
  const { user, updateUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState] = useState({});

  // Award XP and update user
  const awardXP = async (xpAmount, gameName) => {
    try {
      // Update user XP locally
      const newXP = (user.xp || 0) + xpAmount;
      await updateUser({ ...user, xp: newXP });
      
      // Show XP gain notification
      console.log(`+${xpAmount} XP from ${gameName}!`);
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  // Eco Quiz Game
  const EcoQuizGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const questions = [
      {
        question: "Which gas is primarily responsible for global warming?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correct: 1
      },
      {
        question: "How long does it take for a plastic bottle to decompose?",
        options: ["1 year", "10 years", "100 years", "450+ years"],
        correct: 3
      },
      {
        question: "What percentage of Earth's water is freshwater?",
        options: ["3%", "10%", "25%", "50%"],
        correct: 0
      }
    ];

    const handleAnswer = (selectedIndex) => {
      if (selectedIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
      }
      
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameComplete(true);
        const xpEarned = score * 5 + 5; // 5 XP per correct + 5 bonus
        awardXP(xpEarned, 'Eco Quiz');
      }
    };

    const resetGame = () => {
      setCurrentQuestion(0);
      setScore(0);
      setGameComplete(false);
    };

    if (gameComplete) {
      return (
        <div className="game-complete">
          <h4>🎉 Quiz Complete!</h4>
          <p>Score: {score}/{questions.length}</p>
          <p>+{score * 5 + 5} XP Earned!</p>
          <button onClick={resetGame} className="btn btn-primary">Play Again</button>
        </div>
      );
    }

    return (
      <div className="eco-quiz">
        <h4>🧠 Eco Quiz ({currentQuestion + 1}/{questions.length})</h4>
        <p>{questions[currentQuestion].question}</p>
        <div className="quiz-options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="quiz-option"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Recycling Sorter Game
  const RecyclingSorterGame = () => {
    const [items] = useState([
      { name: "Plastic Bottle", type: "plastic", emoji: "🍼" },
      { name: "Newspaper", type: "paper", emoji: "📰" },
      { name: "Banana Peel", type: "organic", emoji: "🍌" },
      { name: "Glass Jar", type: "glass", emoji: "🫙" },
      { name: "Aluminum Can", type: "metal", emoji: "🥤" }
    ]);
    const [currentItem, setCurrentItem] = useState(0);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const bins = [
      { type: "plastic", emoji: "♻️", color: "#2196F3" },
      { type: "paper", emoji: "📄", color: "#4CAF50" },
      { type: "organic", emoji: "🌱", color: "#8BC34A" },
      { type: "glass", emoji: "🫙", color: "#FF9800" },
      { type: "metal", emoji: "🔩", color: "#9E9E9E" }
    ];

    const handleSort = (binType) => {
      if (binType === items[currentItem].type) {
        setScore(score + 1);
      }
      
      if (currentItem + 1 < items.length) {
        setCurrentItem(currentItem + 1);
      } else {
        setGameComplete(true);
        const xpEarned = score * 3 + 2; // 3 XP per correct + 2 bonus
        awardXP(xpEarned, 'Recycling Sorter');
      }
    };

    const resetGame = () => {
      setCurrentItem(0);
      setScore(0);
      setGameComplete(false);
    };

    if (gameComplete) {
      return (
        <div className="game-complete">
          <h4>♻️ Sorting Complete!</h4>
          <p>Score: {score}/{items.length}</p>
          <p>+{score * 3 + 2} XP Earned!</p>
          <button onClick={resetGame} className="btn btn-primary">Sort Again</button>
        </div>
      );
    }

    return (
      <div className="recycling-sorter">
        <h4>♻️ Recycling Sorter ({currentItem + 1}/{items.length})</h4>
        <div className="current-item">
          <span className="item-emoji">{items[currentItem].emoji}</span>
          <p>Sort: {items[currentItem].name}</p>
        </div>
        <div className="recycling-bins">
          {bins.map((bin) => (
            <button
              key={bin.type}
              onClick={() => handleSort(bin.type)}
              className="recycling-bin"
              style={{ borderColor: bin.color }}
            >
              <span>{bin.emoji}</span>
              <small>{bin.type}</small>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Carbon Footprint Calculator
  const CarbonCalculatorGame = () => {
    const [choices, setChoices] = useState({});
    const [result, setResult] = useState(null);

    const scenarios = [
      {
        id: 'transport',
        question: 'How do you usually travel to school?',
        options: [
          { text: 'Walk/Bike', carbon: 0, xp: 10 },
          { text: 'Public Transport', carbon: 2, xp: 7 },
          { text: 'Car', carbon: 5, xp: 3 },
          { text: 'Private Vehicle', carbon: 8, xp: 1 }
        ]
      },
      {
        id: 'energy',
        question: 'How often do you turn off lights when leaving a room?',
        options: [
          { text: 'Always', carbon: 0, xp: 8 },
          { text: 'Usually', carbon: 1, xp: 6 },
          { text: 'Sometimes', carbon: 3, xp: 4 },
          { text: 'Rarely', carbon: 5, xp: 2 }
        ]
      }
    ];

    const handleChoice = (scenarioId, choice) => {
      setChoices({ ...choices, [scenarioId]: choice });
    };

    const calculateFootprint = () => {
      const totalCarbon = Object.values(choices).reduce((sum, choice) => sum + choice.carbon, 0);
      const totalXP = Object.values(choices).reduce((sum, choice) => sum + choice.xp, 0);
      
      setResult({ carbon: totalCarbon, xp: totalXP });
      awardXP(totalXP, 'Carbon Calculator');
    };

    const resetGame = () => {
      setChoices({});
      setResult(null);
    };

    if (result) {
      return (
        <div className="game-complete">
          <h4>🌍 Carbon Footprint Result</h4>
          <p>Carbon Score: {result.carbon} kg CO2</p>
          <p>+{result.xp} XP for eco-awareness!</p>
          <button onClick={resetGame} className="btn btn-primary">Calculate Again</button>
        </div>
      );
    }

    return (
      <div className="carbon-calculator">
        <h4>🌍 Carbon Footprint Calculator</h4>
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario">
            <p>{scenario.question}</p>
            <div className="scenario-options">
              {scenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(scenario.id, option)}
                  className={`scenario-option ${choices[scenario.id] === option ? 'selected' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(choices).length === scenarios.length && (
          <button onClick={calculateFootprint} className="btn btn-success">
            Calculate Footprint
          </button>
        )}
      </div>
    );
  };

  const games = [
    {
      id: 'eco-quiz',
      name: 'Eco Quiz',
      emoji: '🧠',
      description: 'Test your environmental knowledge',
      component: EcoQuizGame
    },
    {
      id: 'recycling-sorter',
      name: 'Recycling Sorter',
      emoji: '♻️',
      description: 'Sort waste into correct bins',
      component: RecyclingSorterGame
    },
    {
      id: 'carbon-calculator',
      name: 'Carbon Calculator',
      emoji: '🌍',
      description: 'Calculate your carbon footprint',
      component: CarbonCalculatorGame
    }
  ];

  return (
    <div className={`mini-games-bar ${isExpanded ? 'expanded' : ''}`}>
      <div className="games-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="toggle-icon">🎮</span>
        <span className="toggle-text">Mini Games</span>
        <span className="toggle-arrow">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="games-content">
          {!activeGame ? (
            <div className="games-grid">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-card"
                  onClick={() => setActiveGame(game)}
                >
                  <span className="game-emoji">{game.emoji}</span>
                  <h4>{game.name}</h4>
                  <p>{game.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="active-game">
              <div className="game-header">
                <button 
                  className="back-btn"
                  onClick={() => setActiveGame(null)}
                >
                  ← Back
                </button>
                <span className="game-title">{activeGame.emoji} {activeGame.name}</span>
              </div>
              <div className="game-content">
                <activeGame.component />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniGamesBar;
