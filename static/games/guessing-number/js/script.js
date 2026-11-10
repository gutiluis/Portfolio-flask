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
const MAX_ATTEMPTS = 5;

let playerName = "";
let secretNumber = 0;
let attempts = 0;
let gameOver = false;

function startGame() {
    secretNumber = Math.floor(Math.random() * 10) + 1;
    attempts = 0;
    gameOver = false;

    attemptsDisplay.textContent = attempts;
    feedback.textContent = "Make your first guess!";
    welcomeMessage.textContent = `Good luck, ${playerName}!`;

    guessInput.value = "";
    guessInput.disabled = false;
    restartButton.hidden = true;

    startSection.hidden = true;
    gameSection.hidden = false;

    guessInput.focus();
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
        guessButton.disabled = true;
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
