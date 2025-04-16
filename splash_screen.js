// // Splash screen JavaScript

// // DOM elements
// const startGameBtn = document.getElementById('start-game-btn');
// const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// // Game configuration to pass to the game screen
// let gameConfig = {
//   difficulty: 'medium'
// };

// // Initialize splash screen
// function init() {
//   // Set up difficulty selection
//   difficultyBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//       difficultyBtns.forEach(b => b.classList.remove('selected'));
//       btn.classList.add('selected');
//       gameConfig.difficulty = btn.dataset.difficulty;
//     });
//   });
  
//   // Select medium difficulty by default
//   document.querySelector('[data-difficulty="medium"]').classList.add('selected');
  
//   // Add event listener to start game button
//   startGameBtn.addEventListener('click', startGame);
// }

// // Start the game - redirect to game screen with parameters
// function startGame() {
//   // Store the selected difficulty in localStorage
//   localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
  
//   // Redirect to game screen
//   window.location.href = 'game_screen.html';
// }

// // Initialize the splash screen when DOM is loaded
// document.addEventListener('DOMContentLoaded', init);

// Splash screen JavaScript

// DOM elements
const startGameBtn = document.getElementById('start-game-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Game configuration to pass to the game screen
let gameConfig = {
  difficulty: 'medium'
};

// Initialize splash screen
function init() {
  // Set up difficulty selection
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      gameConfig.difficulty = btn.dataset.difficulty;
    });
  });
  
  // Select medium difficulty by default
  document.querySelector('[data-difficulty="medium"]').classList.add('selected');
  
  // Add event listener to start game button
  startGameBtn.addEventListener('click', startGame);
}

// Start the game - redirect to game screen with parameters
function startGame() {
  // Store the selected difficulty in localStorage
  localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
  
  // Redirect to game screen
  window.location.href = 'game_screen.html';
}

// Initialize the splash screen when DOM is loaded
document.addEventListener('DOMContentLoaded', init);