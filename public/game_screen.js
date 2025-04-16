// Game screen JavaScript

// Game configuration
const config = {
    easy: {
      timerStart: 12,
      operations: ['+', '-'],
      maxNumber: 15,
      pointsPerQuestion: 10
    },
    medium: {
      timerStart: 10,
      operations: ['+', '-', '*', '/'],
      maxNumber: 30,
      pointsPerQuestion: 20
    },
    hard: {
      timerStart: 8,
      operations: ['+', '-', '*', '/', '%', '^'],
      maxNumber: 50,
      pointsPerQuestion: 30
    }
  };
  
  // Game state
  let gameState = {
    level: 1,
    score: 0,
    lives: 3,
    streak: 0,
    bestStreak: 0,
    timer: 10,
    difficulty: 'medium',
    paused: false,
    powerUps: {
      timeBoost: 1,
      questionSkip: 1,
      fiftyFifty: 1
    }
  };
  
  // DOM elements
  const gameContainer = document.getElementById('game-container');
  const questionEl = document.getElementById('question');
  const planetsEl = document.getElementById('planets');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const levelNumberEl = document.getElementById('level-number');
  const levelTitleEl = document.getElementById('level-title');
  const timerFill = document.getElementById('timer-fill');
  const streakEl = document.getElementById('streak');
  const rocketEl = document.getElementById('rocket');
  const milestones = document.querySelectorAll('.milestone');
  const levelUpModal = document.getElementById('level-up');
  const newLevelNameEl = document.getElementById('new-level-name');
  const levelUpBadgeEl = document.getElementById('level-up-badge');
  const levelUpScoreEl = document.getElementById('level-up-score');
  const continueBtn = document.getElementById('continue-btn');
  const gameOverScreen = document.getElementById('game-over');
  const finalScoreEl = document.getElementById('final-score');
  const finalLevelEl = document.getElementById('final-level');
  const restartBtn = document.getElementById('restart-btn');
  const timeBoostBtn = document.getElementById('time-boost');
  const questionSkipBtn = document.getElementById('question-skip');
  const fiftyFiftyBtn = document.getElementById('fifty-fifty');
  const questionAlien = document.getElementById('question-alien');
  const closeBtn = document.getElementById('close-btn');
  const pauseModal = document.getElementById('pause-modal');
  const resumeBtn = document.getElementById('resume-btn');
  const exitToMenuBtn = document.getElementById('exit-to-menu-btn');
  
  // Audio elements
  const correctSound = document.getElementById('correct-sound');
  const wrongSound = document.getElementById('wrong-sound');
  const levelUpSound = document.getElementById('level-up-sound');
  const backgroundMusic = document.getElementById('background-music');
  
  // Level names and alien characters
  const levelData = [
    { name: "Moon Walker", alien: "👨‍🚀", character: "👨‍🚀" },
    { name: "Asteroid Jumper", alien: "👩‍🚀", character: "🧑‍🚀" },
    { name: "Rocket Captain", alien: "👽", character: "👨‍🚀" },
    { name: "Galaxy Genius", alien: "🛸", character: "👩‍🚀" },
    { name: "Blackhole Hacker", alien: "🤖", character: "🧑‍🚀" },
    { name: "Alien Ace", alien: "👾", character: "👽" }
  ];
  
  // Achievement data
  const achievements = [
    { id: "math-explorer", name: "🏅 Math Explorer", requirement: "Complete Level 1" },
    { id: "space-cadet", name: "🎖️ Space Cadet", requirement: "Score 100 points" },
    { id: "cosmic-calculator", name: "🏆 Cosmic Calculator", requirement: "Get a streak of 5" },
    { id: "galaxy-master", name: "👑 Galaxy Master", requirement: "Reach Level 5" }
  ];
  
  // Game variables
  let interval;
  let correctAnswer;
  let unlockedAchievements = [];
  
  // Initialize game
  function init() {
    // Load game configuration from localStorage
    loadGameConfig();
    
    // Event listeners
    continueBtn.addEventListener('click', continueAfterLevelUp);
    restartBtn.addEventListener('click', restartGame);
    timeBoostBtn.addEventListener('click', useTimeBoost);
    questionSkipBtn.addEventListener('click', useQuestionSkip);
    fiftyFiftyBtn.addEventListener('click', useFiftyFifty);
    closeBtn.addEventListener('click', confirmClose);
    resumeBtn.addEventListener('click', resumeGame);
    exitToMenuBtn.addEventListener('click', exitToMenu);
    
    // Preload audio assets
    correctSound.load();
    wrongSound.load();
    levelUpSound.load();
    backgroundMusic.load();
    backgroundMusic.volume = 0.3;
    
    // Start the game immediately
    startGame();
  }
  
  // Load game configuration
  function loadGameConfig() {
    try {
      const savedConfig = localStorage.getItem('gameConfig');
      if (savedConfig) {
        const config = JSON.stringify(savedConfig);
        // Apply the saved difficulty to game state
        if (config.difficulty) {
          gameState.difficulty = config.difficulty;
        }
      }
    } catch (e) {
      console.error('Error loading game configuration:', e);
    }
  }
  
  // Start the game
  function startGame() {
    // Reset game state based on loaded configuration
    gameState = {
      level: 1,
      score: 0,
      lives: 3,
      streak: 0,
      bestStreak: 0,
      timer: config[gameState.difficulty].timerStart,
      difficulty: gameState.difficulty,
      paused: false,
      powerUps: {
        timeBoost: 1,
        questionSkip: 1,
        fiftyFifty: 1
      }
    };
    
    // Update UI elements
    updateUI();
    updatePowerUps();
    updateMilestones();
    
    // Load first question
    loadQuestion();
    
    // Start timer
    interval = setInterval(updateTimer, 1000);
    
    // Start background music
    backgroundMusic.play();
  }
  
  // function startGame() {
  //   // Reset game state
  //   gameState = {
  //     level: 1,
  //     score: 0,
  //     lives: 3,
  //     streak: 0,
  //     bestStreak: 0,
  //     timer: config[gameState.difficulty].timerStart,
  //     difficulty: gameState.difficulty,
  //     paused: false,
  //     powerUps: {
  //       timeBoost: 1,
  //       questionSkip: 1,
  //       fiftyFifty: 1
  //     }
  //   };
  
  //   // Update UI
  //   updateUI();
  //   updatePowerUps();
  
  //   // Create responsive milestones and rocket position
  //   createMilestones(); // 👈 This replaces updateMilestones()
  
  //   // Load first question
  //   loadQuestion();
  
  //   // Start timer
  //   interval = setInterval(updateTimer, 1000);
  
  //   // Start background music
  //   backgroundMusic.play();
  // }
  

  // Resume the game
  function resumeGame() {
    if (gameState.paused) {
      gameState.paused = false;
      
      // Hide pause modal
      pauseModal.classList.add('hidden');
      
      // Resume background music
      backgroundMusic.play();
      
      // Make planets clickable again
      const planets = document.querySelectorAll('.planet');
      planets.forEach(planet => {
        planet.style.pointerEvents = 'auto';
      });
      
      // Restart the timer
      interval = setInterval(updateTimer, 1000);
    }
  }
  
  // Confirm before closing/exiting the game
  function confirmClose() {
    // Directly pause the game functions
    gameState.paused = true;
    
    // Stop the timer
    clearInterval(interval);
    
    // Pause background music
    backgroundMusic.pause();
    
    // Make planets unclickable
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.style.pointerEvents = 'none';
    });
    
    // Show pause modal with close confirmation
    pauseModal.classList.remove('hidden');
    
    // Modify pause modal to show close confirmation
    const modalContent = pauseModal.querySelector('.modal-content');
    modalContent.innerHTML = `
      <h2>Exit Game?</h2>
      <p>Are you sure you want to exit? Your progress will be lost.</p>
      <button id="cancel-close-btn" class="btn">Cancel</button>
      <button id="confirm-close-btn" class="btn">Exit Game</button>
    `;
    
    // Add event listeners to new buttons
    document.getElementById('cancel-close-btn').addEventListener('click', resumeGame);
    document.getElementById('confirm-close-btn').addEventListener('click', exitToMenu);
  }
  
  // Exit to main menu
  function exitToMenu() {
    // Reset game state
    gameState.paused = false;
    
    // Stop timer and music
    clearInterval(interval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    // Redirect to splash screen
    window.location.href = 'index.html';
  }
  
  // Load a new question
  function loadQuestion() {
    // Reset timer
    gameState.timer = config[gameState.difficulty].timerStart;
    updateTimerBar();
    
    // Generate question based on current level and difficulty
    const { question, correct, choices } = generateQuestion();
    correctAnswer = correct;
    
    // Update question text - use innerHTML to support superscript for exponents
    questionEl.innerHTML = question;
    
    // Update level info
    levelNumberEl.textContent = `Level ${gameState.level}`;
    levelTitleEl.textContent = getLevelName();
    
    // Set alien character based on level
    questionAlien.textContent = levelData[(gameState.level - 1) % levelData.length].alien;
    
    // Create planet answer choices
    planetsEl.innerHTML = '';
    choices.forEach(choice => {
      const planet = document.createElement('div');
      planet.classList.add('planet');
      planet.textContent = choice;
      planet.addEventListener('click', () => checkAnswer(choice));
      planet.style.pointerEvents = 'auto'; // Make sure planets are clickable
      planetsEl.appendChild(planet);
    });
  }
  
  // Generate a question based on current level and difficulty
  function generateQuestion() {
    const diffSettings = config[gameState.difficulty];
    let max = Math.min(diffSettings.maxNumber + (gameState.level * 5), 100);
    
    // Select operation based on level and difficulty
    const availableOps = diffSettings.operations;
    const op = availableOps[Math.floor(Math.random() * availableOps.length)];
    
    let a, b, correct, questionStr;
    
    // Generate numbers based on operation to ensure age-appropriate difficulty
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * max) + 1;
        b = Math.floor(Math.random() * max) + 1;
        correct = a + b;
        questionStr = `${a} + ${b} = ?`;
        break;
        
      case '-':
        a = Math.floor(Math.random() * max) + 10; // Ensure a is reasonably large
        b = Math.floor(Math.random() * a) + 1; // Ensure b <= a for subtraction
        correct = a - b;
        questionStr = `${a} - ${b} = ?`;
        break;
        
      case '*':
        a = Math.floor(Math.random() * Math.min(15, max)) + 2; // Increased multiplication range
        b = Math.floor(Math.random() * Math.min(15, max)) + 2;
        correct = a * b;
        questionStr = `${a} × ${b} = ?`;
        break;
        
      case '/':
        // Create division problems with whole number answers
        b = Math.floor(Math.random() * 10) + 2; // Divisor between 2-11
        correct = Math.floor(Math.random() * 10) + 1; // Quotient between 1-10
        a = b * correct; // Calculate dividend to ensure whole number answer
        questionStr = `${a} ÷ ${b} = ?`;
        break;
        
      case '%':
        // Create percentage problems
        b = [5, 10, 20, 25, 50][Math.floor(Math.random() * 5)]; // Common percentages
        a = Math.floor(Math.random() * 100) + 20; // Number between 20-119
        correct = Math.round((a * b) / 100); // Calculate percentage
        questionStr = `${b}% of ${a} = ?`;
        break;
        
      case '^':
        // Create power problems (exponents)
        a = Math.floor(Math.random() * 10) + 2; // Base between 2-11
        b = Math.floor(Math.random() * 3) + 2; // Exponent between 2-4
        correct = Math.pow(a, b);
        questionStr = `${a}<sup>${b}</sup> = ?`;
        break;
    }
    
    // Generate choices including the correct answer
    let choices = [correct];
    
    // Generate 3 incorrect but reasonable choices
    while (choices.length < 4) {
      // Create a wrong answer that's close to the correct one
      let offset;
      
      if (op === '%' || op === '/') {
        // For percentage and division, use smaller offsets
        offset = Math.floor(Math.random() * 6) - 3;
      } else if (op === '^' && correct > 50) {
        // For large power results, use percentage-based offsets
        const percentOffset = Math.floor(Math.random() * 30) - 15;
        offset = Math.floor(correct * percentOffset / 100);
      } else {
        // For other operations
        offset = Math.floor(Math.random() * (Math.min(10, Math.max(5, Math.floor(correct * 0.2))))) * (Math.random() < 0.5 ? 1 : -1);
      }
      
      // Ensure offset isn't 0 (would be correct answer)
      if (offset === 0) offset = Math.random() < 0.5 ? 1 : -1;
      
      let wrong = correct + offset;
      // Ensure answer is positive and not already in choices
      if (wrong > 0 && !choices.includes(wrong)) {
        choices.push(wrong);
      }
    }
    
    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);
    
    return { question: questionStr, correct, choices };
  }
  
  // Get level name based on current level
  function getLevelName() {
    return levelData[(gameState.level - 1) % levelData.length].name;
  }
  
  // Check if answer is correct
  function checkAnswer(choice) {
    // Prevent multiple clicks
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.style.pointerEvents = 'none';
    });
    
    if (choice === correctAnswer) {
      // Correct answer
      correctSound.play();
      
      // Highlight correct planet
      const correctPlanet = Array.from(planets).find(p => parseInt(p.textContent) === correctAnswer);
      correctPlanet.classList.add('correct');
      
      // Update score and streak
      const points = config[gameState.difficulty].pointsPerQuestion;
      gameState.score += points;
      gameState.streak++;
      
      if (gameState.streak > gameState.bestStreak) {
        gameState.bestStreak = gameState.streak;
      }
      
      // Check for streak achievement
      if (gameState.streak === 5) {
        unlockAchievement('cosmic-calculator');
      }
      
      // Check for score achievement
      if (gameState.score >= 100 && !unlockedAchievements.includes('space-cadet')) {
        unlockAchievement('space-cadet');
      }
      
      // Update UI
      updateUI();
      
      // Load next question after a short delay
      setTimeout(() => {
        // Check if should level up
        if (gameState.level < 6 && gameState.score >= gameState.level * 50) {
          levelUp();
        } else {
          loadQuestion();
        }
      }, 1000);
    } else {
      // Wrong answer
      wrongSound.play();
      
      // Highlight wrong planet and show correct one
      const selectedPlanet = Array.from(planets).find(p => parseInt(p.textContent) === choice);
      const correctPlanet = Array.from(planets).find(p => parseInt(p.textContent) === correctAnswer);
      
      selectedPlanet.classList.add('wrong');
      setTimeout(() => {
        correctPlanet.classList.add('correct');
      }, 500);
      
      // Reset streak and lose life
      gameState.streak = 0;
      gameState.lives--;
      updateUI();
      
      // Check if game over
      if (gameState.lives <= 0) {
        setTimeout(endGame, 1500);
      } else {
        // Load next question after a delay
        setTimeout(loadQuestion, 1500);
      }
    }
  }
  
  // Level up
  function levelUp() {
    // Stop timer
    clearInterval(interval);
    
    // Increment level
    gameState.level++;
    
    // Check for level achievement
    if (gameState.level === 2) {
      unlockAchievement('math-explorer');
    }
    if (gameState.level === 5) {
      unlockAchievement('galaxy-master');
    }
    
    // Update UI
    updateUI();
    updateMilestones();
    
    // Play level up sound
    levelUpSound.play();
    
    // Show level up modal
    newLevelNameEl.textContent = getLevelName();
    levelUpBadgeEl.textContent = gameState.level;
    levelUpScoreEl.textContent = gameState.score;
    levelUpModal.classList.remove('hidden');
    
    // Make sure the continue button is clickable and working
    continueBtn.style.pointerEvents = 'auto';
  }
  
  // Continue after level up
  function continueAfterLevelUp() {
    levelUpModal.classList.add('hidden');
    
    // Clear any existing interval first to prevent multiple intervals
    clearInterval(interval);
    
    // Load the next question
    loadQuestion();
    
    // Start a fresh timer interval
    interval = setInterval(updateTimer, 1000);
    
    // Make sure planets are clickable
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.style.pointerEvents = 'auto';
    });
  }
  
  // Update timer
  function updateTimer() {
    if (gameState.paused) return; // Don't update timer if game is paused
    
    gameState.timer--;
    updateTimerBar();
    
    if (gameState.timer <= 0) {
      // Out of time
      clearInterval(interval);
      gameState.lives--;
      gameState.streak = 0;
      updateUI();
      
      if (gameState.lives <= 0) {
        endGame();
      } else {
        setTimeout(loadQuestion, 1000);
        interval = setInterval(updateTimer, 1000);
      }
    }
  }
  
  // Update timer bar
  function updateTimerBar() {
    const percentage = (gameState.timer / config[gameState.difficulty].timerStart) * 100;
    timerFill.style.width = `${percentage}%`;
    
    // Change color based on time left
    if (percentage > 60) {
      timerFill.style.background = 'linear-gradient(90deg, #2ec4b6, #11574f)';
    } else if (percentage > 30) {
      timerFill.style.background = 'linear-gradient(90deg, #fdbb2d, #904805)';
    } else {
      timerFill.style.background = 'linear-gradient(90deg, #ff5f6d, #9b0f19)';
    }
  }
  
  // Update UI elements
  function updateUI() {
    scoreEl.textContent = gameState.score;
    livesEl.textContent = gameState.lives;
    streakEl.textContent = gameState.streak;
  }
  
  // Update power up UI
  function updatePowerUps() {
    timeBoostBtn.disabled = gameState.powerUps.timeBoost <= 0;
    questionSkipBtn.disabled = gameState.powerUps.questionSkip <= 0;
    fiftyFiftyBtn.disabled = gameState.powerUps.fiftyFifty <= 0;
  }
  
  // Update milestone visuals
  function updateMilestones() {
    milestones.forEach((milestone, index) => {
      const level = parseInt(milestone.dataset.level);
      
      if (level < gameState.level) {
        milestone.classList.add('reached');
        milestone.classList.remove('current');
      } else if (level === gameState.level) {
        milestone.classList.add('current');
        milestone.classList.remove('reached');
      } else {
        milestone.classList.remove('reached', 'current');
      }
    });
    
    // Update rocket position with constraint for container boundaries
    const maxLevel = 6; // Based on your levelData array having 6 levels
    let progressPercentage = ((gameState.level - 1) / (maxLevel - 1)) * 100;
    
    // Set bounds to account for the rocket's width
    // Limiting to 95% max ensures it doesn't go beyond the visual container
    if (progressPercentage > 95) progressPercentage = 95;
    if (progressPercentage < 5) progressPercentage = 5;
    
    rocketEl.style.left = `${progressPercentage}%`;
  }
  
  // Use time boost power up
  function useTimeBoost() {
    if (gameState.powerUps.timeBoost > 0) {
      gameState.powerUps.timeBoost--;
      gameState.timer += 5;
      if (gameState.timer > config[gameState.difficulty].timerStart) {
        gameState.timer = config[gameState.difficulty].timerStart;
      }
      updateTimerBar();
      updatePowerUps();
      
      // Show effect - Create a more visible effect
      timerFill.classList.add('pulse');
      
      // Create and add time boost indicator
      const boostEffect = document.createElement('div');
      boostEffect.classList.add('timer-boost-effect');
      boostEffect.textContent = '+5s';
      document.querySelector('.timer-container').appendChild(boostEffect);
      
      // Remove effect after animation completes
      setTimeout(() => {
        timerFill.classList.remove('pulse');
        boostEffect.remove();
      }, 1000);
    }
  }
  
  // Use question skip power up
  function useQuestionSkip() {
    if (gameState.powerUps.questionSkip > 0) {
      gameState.powerUps.questionSkip--;
      updatePowerUps();
      loadQuestion();
    }
  }
  
  // Use fifty-fifty power up
  function useFiftyFifty() {
    if (gameState.powerUps.fiftyFifty > 0 && document.querySelectorAll('.planet:not(.eliminated)').length > 2) {
      gameState.powerUps.fiftyFifty--;
      updatePowerUps();
      
      // Find all incorrect planets
      const planets = document.querySelectorAll('.planet');
      const incorrectPlanets = Array.from(planets).filter(p => parseInt(p.textContent) !== correctAnswer);
      
      // Randomly eliminate 2 incorrect planets
      incorrectPlanets.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(2, incorrectPlanets.length); i++) {
        incorrectPlanets[i].classList.add('eliminated');
      }
    }
  }
  
  // Unlock achievement
  function unlockAchievement(id) {
    if (!unlockedAchievements.includes(id)) {
      unlockedAchievements.push(id);
      
      // Show achievement notification
      const achievement = achievements.find(a => a.id === id);
      if (achievement) {
        const notification = document.createElement('div');
        notification.classList.add('achievement-notification');
        notification.innerHTML = `<div>🏆 Achievement Unlocked!</div><div>${achievement.name}</div>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('show');
          setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
          }, 3000);
        }, 100);
      }
    }
  }
  
  // End game
  function endGame() {
    // Stop timer and music
    clearInterval(interval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    // Update final score and level
    finalScoreEl.textContent = gameState.score;
    finalLevelEl.textContent = `Level ${gameState.level} (${getLevelName()})`;
    
    // Display achievements
    const achievementsContainer = document.getElementById('achievements');
    achievementsContainer.innerHTML = '';
    
    if (unlockedAchievements.length === 0) {
      achievementsContainer.innerHTML = '<div class="achievement">Keep practicing!</div>';
    } else {
      unlockedAchievements.forEach(id => {
        const achievement = achievements.find(a => a.id === id);
        if (achievement) {
          const achievementEl = document.createElement('div');
          achievementEl.classList.add('achievement');
          achievementEl.textContent = achievement.name;
          achievementsContainer.appendChild(achievementEl);
        }
      });
    }
    
    // Set result character based on score
    const resultCharacter = document.querySelector('.result-character');
    if (gameState.score > 150) {
      resultCharacter.textContent = '🚀';
    } else if (gameState.score > 100) {
      resultCharacter.textContent = '👨‍🚀';
    } else if (gameState.score > 50) {
      resultCharacter.textContent = '🌟';
    } else {
      resultCharacter.textContent = '🌙';
    }
    
    // Show game over screen
    gameOverScreen.classList.remove('hidden');
  }
  
  // Restart game
  function restartGame() {
    // Reset achievements for new game
    unlockedAchievements = [];
    
    // Hide game over screen
    gameOverScreen.classList.add('hidden');
    
    // Redirect to splash screen
    window.location.href = 'splash_screen.html';
  }
  
  function createMilestones() {
    const progressTrack = document.getElementById('progress-track');
    progressTrack.innerHTML = '';
  
    const maxLevel = 6;
    for (let i = 1; i <= maxLevel; i++) {
      const milestone = document.createElement('div');
      milestone.classList.add('milestone');
      milestone.dataset.level = i;
      milestone.textContent = '🪐';
  
      // Position based on percent across the track
      milestone.style.left = `${((i - 1) / (maxLevel - 1)) * 100}%`;
  
      // Styling based on progress
      if (i < gameState.level) {
        milestone.classList.add('reached');
      } else if (i === gameState.level) {
        milestone.classList.add('current');
      }
  
      progressTrack.appendChild(milestone);
    }
  
    updateRocketPosition(); // Ensure rocket matches milestone progress
  }

  function updateRocketPosition() {
    const maxLevel = 6;
    let progressPercentage = ((gameState.level - 1) / (maxLevel - 1)) * 100;
  
    // Ensure bounds are respected
    if (progressPercentage > 95) progressPercentage = 95;
    if (progressPercentage < 0) progressPercentage = 0;
  
    rocketEl.style.left = `${progressPercentage}%`;
  }
  

  // Initialize the game when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);


