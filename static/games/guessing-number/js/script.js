// html element DOM references
const startForm = document.querySelector("#start-form");
const guessForm = document.querySelector("#guess-form");
const restartButton = document.querySelector("#restart-button");

const startSection = document.querySelector("#start-section");
const gameSection = document.querySelector("#game-section");

const playerNameInput = document.querySelector("#player-name");
const guessInput = document.querySelector("#guess");

const welcomeMessage = document.querySelector("#welcome-message");
const feedback = document.querySelector("#feedback");
const attemptsDisplay = document.querySelector("#attempts");
const scoresList = document.getElementById("scores-list");
const scoresSection = document.getElementById("scores-section");
const scores = [];
const MAX_ATTEMPTS = 5;

// player name local storage key
let playerName = localStorage.getItem("playerName") || "";
let secretNumber = 0;
let attempts = 0;
let gameOver = false;

// dissapear iframe memory management garbage collector references. instead of window.localStorage
function saveScore(playerName, attempts) {
    const existingScore = scores.find(
        (score) => score.playerName.toLowerCase() === playerName.toLowerCase(),
    );
    if (existingScore) {
        if (attempts < existingScore.attempts) {
            existingScore.attempts = attempts;
        }
    } else {
        scores.push({ playerName, attempts });
    }
}

function startGame() {
    secretNumber = Math.floor(Math.random() * 10) + 1;
    attempts = 0;
    gameOver = false;

    attemptsDisplay.textContent = attempts;
    feedback.textContent = "Make your first guess!";
    welcomeMessage.textContent = `Good luck, ${playerName}!`;
    localStorage.setItem("playerName", playerName);

    guessInput.value = "";
    guessInput.disabled = false;
    restartButton.hidden = true;

    startSection.hidden = true;
    gameSection.hidden = false;
    guessInput.hidden = false;

    guessInput.focus();
}

function displayScores() {
    scoresSection.hidden = scores.length === 0;
    scoresList.innerHTML = "";

    if (scores.length === 0) {
        scoresList.textContent = "No scores available yet.";
        return;
    }

    scores.forEach((score) => {
        const li = document.createElement("li");
        li.textContent = `${score.playerName} - ${score.attempts} attempts`;
        scoresList.appendChild(li);
    });
}

function checkGuess(guess) {
    if (gameOver) return;

    if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
        feedback.textContent = "Enter a number between 1 and 10.";
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (guess === secretNumber) {
        feedback.textContent = `Congratulations, ${playerName}! You guessed it in ${attempts} attempts.`;
        saveScore(playerName, attempts);
        displayScores();

        gameOver = true;
        guessInput.disabled = true;
        restartButton.hidden = false;
        return;
    }

    feedback.textContent =
        guess < secretNumber
            ? "Too low! Try a higher number."
            : "Too high! Try a lower number.";

    guessInput.value = "";
    guessInput.focus();

    if (attempts >= MAX_ATTEMPTS && guess !== secretNumber) {
        feedback.textContent = `Game over! The number was ${secretNumber}.`;
        restartButton.hidden = false;
        guessInput.hidden = true;
    }
}

startForm.addEventListener("submit", (event) => {
    event.preventDefault();

    playerName = playerNameInput.value.trim();

    if (!playerName) return;

    startGame();
});

guessForm.addEventListener("submit", (event) => {
    event.preventDefault();

    checkGuess(Number(guessInput.value));
});

restartButton.addEventListener("click", startGame);
displayScores();
