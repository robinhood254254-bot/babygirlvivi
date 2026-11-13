const PASSWORD = "whenever you're ready";

const gate = document.querySelector('#gate');
const lovePage = document.querySelector('#love-page');
const passwordInput = document.querySelector('#password');
const errorMessage = document.querySelector('#error');

document.querySelector('#unlock-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const answer = passwordInput.value.trim().toLocaleLowerCase().replace(/[’‘]/g, "'");
  if (answer === PASSWORD) {
    gate.classList.add('is-hidden');
    lovePage.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    startTyping();
    window.requestAnimationFrame(() => {
      moveHeart();
      startHopping();
    });
  } else {
    errorMessage.textContent = 'Not quite, Babygirl 💌 Try the phrase I told you.';
    passwordInput.setAttribute('aria-invalid', 'true');
    passwordInput.focus();
  }
});

passwordInput.addEventListener('input', () => {
  errorMessage.textContent = '';
  passwordInput.removeAttribute('aria-invalid');
});

const messages = [
  'I love you, just as you are. 🤍',
  'Your honesty is always welcome here. 🌷',
  'I’ll keep showing up with care. ✨',
];
let messageIndex = 0;
let characterIndex = 0;
let deleting = false;
const typedMessage = document.querySelector('#typed-message');

function startTyping() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedMessage.textContent = messages[0];
    return;
  }
  const current = messages[messageIndex];
  typedMessage.textContent = current.slice(0, characterIndex);
  if (!deleting && characterIndex < current.length) {
    characterIndex++;
    window.setTimeout(startTyping, 58);
  } else if (!deleting) {
    deleting = true;
    window.setTimeout(startTyping, 1900);
  } else if (characterIndex > 0) {
    characterIndex--;
    window.setTimeout(startTyping, 27);
  } else {
    deleting = false;
    messageIndex = (messageIndex + 1) % messages.length;
    window.setTimeout(startTyping, 350);
  }
}

const runnerHeart = document.querySelector('#runner-heart');
const playfield = document.querySelector('#playfield');
const scoreDisplay = document.querySelector('#score-display');
const progressText = document.querySelector('#progress-text');
const gameMessage = document.querySelector('#game-message');
const playAgain = document.querySelector('#play-again');
const replyCard = document.querySelector('#reply-card');
document.querySelectorAll('.reply-option[data-message]').forEach((link) => {
  link.href = `https://wa.me/254710837083?text=${encodeURIComponent(link.dataset.message)}`;
});
const targetScore = 8;
let score = 0;
let hopTimer;
let gameComplete = false;

function moveHeart() {
  if (gameComplete) return;
  const bounds = playfield.getBoundingClientRect();
  const heartSize = runnerHeart.offsetWidth || 72;
  const padding = 12;
  const maxX = Math.max(padding, bounds.width - heartSize - padding);
  const maxY = Math.max(padding, bounds.height - heartSize - padding);
  let x = padding + Math.random() * (maxX - padding);
  let y = padding + Math.random() * (maxY - padding);
  const minTravel = Math.min(bounds.width, bounds.height) * 0.36;
  const oldX = Number.parseFloat(runnerHeart.style.left) || 0;
  const oldY = Number.parseFloat(runnerHeart.style.top) || 0;
  for (let attempt = 0; attempt < 12; attempt++) {
    const nextX = padding + Math.random() * (maxX - padding);
    const nextY = padding + Math.random() * (maxY - padding);
    if (Math.hypot(nextX - oldX, nextY - oldY) >= minTravel) {
      x = nextX;
      y = nextY;
      break;
    }
  }
  runnerHeart.style.left = `${x}px`;
  runnerHeart.style.top = `${y}px`;
}

function sprinkleBurst() {
  const burst = document.createElement('span');
  burst.className = 'emoji-burst';
  burst.setAttribute('aria-hidden', 'true');
  burst.textContent = ['✨', '🌸', '💗', '🎀', '💕'][Math.floor(Math.random() * 5)];
  burst.style.left = `${runnerHeart.offsetLeft + runnerHeart.offsetWidth / 2}px`;
  burst.style.top = `${runnerHeart.offsetTop + runnerHeart.offsetHeight / 2}px`;
  playfield.append(burst);
  window.setTimeout(() => burst.remove(), 850);
}

function startHopping() {
  window.clearInterval(hopTimer);
  hopTimer = window.setInterval(moveHeart, 1550);
}

runnerHeart.addEventListener('click', () => {
  if (gameComplete) return;
  score++;
  scoreDisplay.textContent = `💗 ${score} / ${targetScore}`;
  progressText.textContent = score === targetScore ? 'You caught it! 🎉' : ['Nice catch!', 'You’re quick, Big Girl!', 'It can’t escape you!'][score % 3];
  runnerHeart.classList.remove('caught');
  void runnerHeart.offsetWidth;
  runnerHeart.classList.add('caught');
  sprinkleBurst();

  if (score >= targetScore) {
    gameComplete = true;
    window.clearInterval(hopTimer);
    runnerHeart.classList.add('is-hidden');
    gameMessage.classList.remove('is-hidden');
    replyCard.classList.remove('is-hidden');
    progressText.textContent = 'All caught! You’re the champion, Big Girl!';
    window.setTimeout(() => replyCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    return;
  }
  moveHeart();
});

playAgain.addEventListener('click', () => {
  score = 0;
  gameComplete = false;
  scoreDisplay.textContent = `💗 0 / ${targetScore}`;
  progressText.textContent = 'Ready when you are!';
  gameMessage.classList.add('is-hidden');
  replyCard.classList.add('is-hidden');
  runnerHeart.classList.remove('is-hidden');
  moveHeart();
  startHopping();
});

window.addEventListener('resize', moveHeart);
