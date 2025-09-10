import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Games.css';

const Games = () => {
  const { user, updateUser } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState({});
  const [showResult, setShowResult] = useState(false);

  // Eco Quiz Game
  const ecoQuizQuestions = [
    {
      question: "What percentage of Earth's water is freshwater?",
      options: ["3%", "10%", "25%", "50%"],
      correct: 0,
      explanation: "Only about 3% of Earth's water is freshwater, and most of that is frozen in ice caps and glaciers."
    },
    {
      question: "Which gas is primarily responsible for global warming?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2,
      explanation: "Carbon dioxide (CO2) is the primary greenhouse gas responsible for global warming."
    },
    {
      question: "How long does it take for a plastic bottle to decompose?",
      options: ["10 years", "50 years", "100 years", "450+ years"],
      correct: 3,
      explanation: "Plastic bottles can take 450+ years to decompose in landfills."
    },
    {
      question: "What is the most renewable source of energy?",
      options: ["Coal", "Solar", "Natural Gas", "Nuclear"],
      correct: 1,
      explanation: "Solar energy is completely renewable and sustainable, powered by the sun."
    },
    {
      question: "Which activity saves the most water?",
      options: ["Shorter showers", "Fixing leaks", "Using dishwasher", "All of the above"],
      correct: 3,
      explanation: "All these activities contribute significantly to water conservation."
    }
  ];

  // Recycling Sorter Game
  const recyclingItems = [
    { name: "Plastic Bottle", bin: "plastic", emoji: "🍶" },
    { name: "Newspaper", bin: "paper", emoji: "📰" },
    { name: "Banana Peel", bin: "organic", emoji: "🍌" },
    { name: "Glass Jar", bin: "glass", emoji: "🫙" },
    { name: "Aluminum Can", bin: "metal", emoji: "🥤" },
    { name: "Cardboard Box", bin: "paper", emoji: "📦" },
    { name: "Apple Core", bin: "organic", emoji: "🍎" },
    { name: "Wine Bottle", bin: "glass", emoji: "🍷" }
  ];

  // Carbon Footprint Calculator
  const carbonQuestions = [
    {
      question: "How do you usually commute to work/school?",
      options: [
        { text: "Walk or bike", points: 10 },
        { text: "Public transport", points: 7 },
        { text: "Carpool", points: 5 },
        { text: "Drive alone", points: 2 }
      ]
    },
    {
      question: "How often do you eat meat?",
      options: [
        { text: "Never (vegetarian/vegan)", points: 10 },
        { text: "1-2 times per week", points: 8 },
        { text: "3-5 times per week", points: 5 },
        { text: "Daily", points: 2 }
      ]
    },
    {
      question: "How do you handle household energy?",
      options: [
        { text: "Use renewable energy & LED bulbs", points: 10 },
        { text: "Energy-efficient appliances", points: 7 },
        { text: "Turn off lights when not needed", points: 5 },
        { text: "Don't pay attention to energy use", points: 1 }
      ]
    }
  ];

  const startGame = (gameType) => {
    setSelectedGame(gameType);
    setShowResult(false);
    
    if (gameType === 'quiz') {
      setGameState({
        currentQuestion: 0,
        score: 0,
        answers: []
      });
    } else if (gameType === 'recycling') {
      setGameState({
        currentItem: 0,
        score: 0,
        items: [...recyclingItems].sort(() => Math.random() - 0.5)
      });
    } else if (gameType === 'carbon') {
      setGameState({
        currentQuestion: 0,
        totalPoints: 0,
        answers: []
      });
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    const currentQ = ecoQuizQuestions[gameState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    const newScore = gameState.score + (isCorrect ? 1 : 0);
    
    const newAnswers = [...gameState.answers, {
      question: currentQ.question,
      selected: answerIndex,
      correct: currentQ.correct,
      isCorrect,
      explanation: currentQ.explanation
    }];

    if (gameState.currentQuestion < ecoQuizQuestions.length - 1) {
      setGameState({
        ...gameState,
        currentQuestion: gameState.currentQuestion + 1,
        score: newScore,
        answers: newAnswers
      });
    } else {
      // Game finished
      const xpEarned = newScore * 5 + (newScore === ecoQuizQuestions.length ? 5 : 0);
      awardXP(xpEarned);
      setGameState({
        ...gameState,
        score: newScore,
        answers: newAnswers,
        finished: true,
        xpEarned
      });
      setShowResult(true);
    }
  };

  const handleRecyclingSort = (binType) => {
    const currentItem = gameState.items[gameState.currentItem];
    const isCorrect = binType === currentItem.bin;
    const newScore = gameState.score + (isCorrect ? 1 : 0);

    if (gameState.currentItem < gameState.items.length - 1) {
      setGameState({
        ...gameState,
        currentItem: gameState.currentItem + 1,
        score: newScore
      });
    } else {
      // Game finished
      const xpEarned = newScore * 3 + (newScore >= 6 ? 2 : 0);
      awardXP(xpEarned);
      setGameState({
        ...gameState,
        score: newScore,
        finished: true,
        xpEarned
      });
      setShowResult(true);
    }
  };

  const handleCarbonAnswer = (answerIndex) => {
    const currentQ = carbonQuestions[gameState.currentQuestion];
    const points = currentQ.options[answerIndex].points;
    const newTotal = gameState.totalPoints + points;
    
    const newAnswers = [...gameState.answers, {
      question: currentQ.question,
      selected: answerIndex,
      points
    }];

    if (gameState.currentQuestion < carbonQuestions.length - 1) {
      setGameState({
        ...gameState,
        currentQuestion: gameState.currentQuestion + 1,
        totalPoints: newTotal,
        answers: newAnswers
      });
    } else {
      // Game finished
      const xpEarned = Math.floor(newTotal / 3);
      awardXP(xpEarned);
      setGameState({
        ...gameState,
        totalPoints: newTotal,
        answers: newAnswers,
        finished: true,
        xpEarned
      });
      setShowResult(true);
    }
  };

  const awardXP = async (xpAmount) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        const updatedUser = {
          ...userData,
          xp: userData.xp + xpAmount,
          points: userData.points + xpAmount
        };
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameState({});
    setShowResult(false);
  };

  if (!selectedGame) {
    return (
      <div className="games-page">
        <div className="container">
          <div className="games-header">
            <h1>🎮 Environmental Games</h1>
            <p>Learn about the environment while having fun and earning XP!</p>
          </div>

          <div className="games-grid">
            <div className="game-card" onClick={() => startGame('quiz')}>
              <div className="game-icon">🧠</div>
              <h3>Eco Quiz</h3>
              <p>Test your environmental knowledge with fun questions</p>
              <div className="game-reward">Earn up to 30 XP</div>
            </div>

            <div className="game-card" onClick={() => startGame('recycling')}>
              <div className="game-icon">♻️</div>
              <h3>Recycling Sorter</h3>
              <p>Sort waste items into the correct recycling bins</p>
              <div className="game-reward">Earn up to 26 XP</div>
            </div>

            <div className="game-card" onClick={() => startGame('carbon')}>
              <div className="game-icon">🌍</div>
              <h3>Carbon Footprint</h3>
              <p>Calculate your environmental impact and learn to reduce it</p>
              <div className="game-reward">Earn up to 10 XP</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Eco Quiz Game UI
  if (selectedGame === 'quiz' && !showResult) {
    const currentQ = ecoQuizQuestions[gameState.currentQuestion];
    return (
      <div className="games-page">
        <div className="container">
          <div className="game-header">
            <button onClick={resetGame} className="back-btn">← Back to Games</button>
            <h2>🧠 Eco Quiz</h2>
            <div className="progress">Question {gameState.currentQuestion + 1} of {ecoQuizQuestions.length}</div>
          </div>

          <div className="quiz-container">
            <div className="question-card">
              <h3>{currentQ.question}</h3>
              <div className="options">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() => handleQuizAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Recycling Game UI
  if (selectedGame === 'recycling' && !showResult) {
    const currentItem = gameState.items[gameState.currentItem];
    return (
      <div className="games-page">
        <div className="container">
          <div className="game-header">
            <button onClick={resetGame} className="back-btn">← Back to Games</button>
            <h2>♻️ Recycling Sorter</h2>
            <div className="progress">Item {gameState.currentItem + 1} of {gameState.items.length}</div>
          </div>

          <div className="recycling-container">
            <div className="item-to-sort">
              <div className="item-emoji">{currentItem.emoji}</div>
              <h3>{currentItem.name}</h3>
              <p>Which bin does this belong in?</p>
            </div>

            <div className="bins">
              <button className="bin plastic" onClick={() => handleRecyclingSort('plastic')}>
                🗂️ Plastic
              </button>
              <button className="bin paper" onClick={() => handleRecyclingSort('paper')}>
                📄 Paper
              </button>
              <button className="bin glass" onClick={() => handleRecyclingSort('glass')}>
                🫙 Glass
              </button>
              <button className="bin metal" onClick={() => handleRecyclingSort('metal')}>
                🥤 Metal
              </button>
              <button className="bin organic" onClick={() => handleRecyclingSort('organic')}>
                🌱 Organic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Carbon Footprint Game UI
  if (selectedGame === 'carbon' && !showResult) {
    const currentQ = carbonQuestions[gameState.currentQuestion];
    return (
      <div className="games-page">
        <div className="container">
          <div className="game-header">
            <button onClick={resetGame} className="back-btn">← Back to Games</button>
            <h2>🌍 Carbon Footprint Calculator</h2>
            <div className="progress">Question {gameState.currentQuestion + 1} of {carbonQuestions.length}</div>
          </div>

          <div className="carbon-container">
            <div className="question-card">
              <h3>{currentQ.question}</h3>
              <div className="options">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn carbon-option"
                    onClick={() => handleCarbonAnswer(index)}
                  >
                    {option.text}
                    <span className="eco-points">+{option.points} eco points</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results UI
  if (showResult) {
    return (
      <div className="games-page">
        <div className="container">
          <div className="results-container">
            <div className="results-header">
              <h2>🎉 Game Complete!</h2>
              <div className="xp-earned">+{gameState.xpEarned} XP</div>
            </div>

            {selectedGame === 'quiz' && (
              <div className="quiz-results">
                <div className="score">Score: {gameState.score}/{ecoQuizQuestions.length}</div>
                <div className="answers-review">
                  {gameState.answers.map((answer, index) => (
                    <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      <h4>{answer.question}</h4>
                      <p className="explanation">{answer.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedGame === 'recycling' && (
              <div className="recycling-results">
                <div className="score">Score: {gameState.score}/{gameState.items.length}</div>
                <p>Great job learning about proper recycling!</p>
              </div>
            )}

            {selectedGame === 'carbon' && (
              <div className="carbon-results">
                <div className="score">Eco Score: {gameState.totalPoints}/30</div>
                <p>
                  {gameState.totalPoints >= 25 ? "Excellent! You're very eco-friendly!" :
                   gameState.totalPoints >= 20 ? "Good job! You're making a positive impact!" :
                   gameState.totalPoints >= 15 ? "Not bad! There's room for improvement!" :
                   "Consider making more eco-friendly choices!"}
                </p>
              </div>
            )}

            <div className="results-actions">
              <button onClick={() => startGame(selectedGame)} className="btn btn-primary">
                Play Again
              </button>
              <button onClick={resetGame} className="btn btn-secondary">
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Games;
