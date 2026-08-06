// Main app controller: screens, game loop, adaptive leveling, parent dashboard.

const SESSION_LENGTH = 10;

let profile = loadProfile();

let session = null;   // current session-in-progress stats
let puzzle = null;    // current puzzle on screen
let selected = [];    // selected tile ids for current puzzle
let puzzleStartTime = 0;
let puzzleAttempts = 0;
let locked = false;   // true while a correct-answer transition animation plays

// ---------- element refs ----------
const el = {
  startName: document.getElementById('start-name'),
  startLevelLabel: document.getElementById('start-level-label'),
  btnPlay: document.getElementById('btn-play'),
  btnMute: document.getElementById('btn-mute'),
  btnParent: document.getElementById('btn-parent'),

  screenStart: document.getElementById('screen-start'),
  screenGame: document.getElementById('screen-game'),
  screenSummary: document.getElementById('screen-summary'),

  sessionDots: document.getElementById('session-dots'),
  starsCount: document.getElementById('stars-count'),
  opBadge: document.getElementById('op-badge'),
  targetNumber: document.getElementById('target-number'),
  tilesGrid: document.getElementById('tiles-grid'),
  feedback: document.getElementById('feedback'),

  summaryMascot: document.getElementById('summary-mascot'),
  summaryStars: document.getElementById('summary-stars'),
  summaryText: document.getElementById('summary-text'),
  summaryLevelChange: document.getElementById('summary-level-change'),
  btnPlayAgain: document.getElementById('btn-play-again'),
  btnHome: document.getElementById('btn-home'),

  parentModal: document.getElementById('parent-modal'),
  btnCloseParent: document.getElementById('btn-close-parent'),
  inputName: document.getElementById('input-name'),
  statLevel: document.getElementById('stat-level'),
  statStage: document.getElementById('stat-stage'),
  statTotal: document.getElementById('stat-total'),
  statAccuracy: document.getElementById('stat-accuracy'),
  progressChart: document.getElementById('progress-chart'),
  selectLevel: document.getElementById('select-level'),
  btnSaveParent: document.getElementById('btn-save-parent'),
  btnResetProgress: document.getElementById('btn-reset-progress'),
};

const OP_SYMBOL = { add: '+', subtract: '−', multiply: '×' };

function showScreen(name) {
  [el.screenStart, el.screenGame, el.screenSummary].forEach(s => s.classList.add('hidden'));
  if (name === 'start') el.screenStart.classList.remove('hidden');
  if (name === 'game') el.screenGame.classList.remove('hidden');
  if (name === 'summary') el.screenSummary.classList.remove('hidden');
}

function refreshStartScreen() {
  el.startName.textContent = profile.name;
  const level = getLevel(profile.levelId);
  const stage = getStage(level.stage);
  el.startLevelLabel.textContent = `Level ${level.id}: ${level.label} (${stage.name})`;
  el.btnMute.textContent = profile.muted ? '🔇' : '🔊';
}

// ---------- session / game flow ----------

function startSession() {
  session = { puzzlesCompleted: 0, firstTryCorrect: 0, times: [], levelId: profile.levelId };
  renderSessionDots();
  el.starsCount.textContent = '0';
  showScreen('game');
  nextPuzzle();
}

function renderSessionDots() {
  el.sessionDots.innerHTML = '';
  for (let i = 0; i < SESSION_LENGTH; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i < session.puzzlesCompleted ? ' filled' : '');
    el.sessionDots.appendChild(d);
  }
}

function nextPuzzle() {
  if (session.puzzlesCompleted >= SESSION_LENGTH) {
    finishSession();
    return;
  }
  const level = getLevel(profile.levelId);
  puzzle = generatePuzzle(level);
  selected = [];
  puzzleAttempts = 0;
  puzzleStartTime = Date.now();
  locked = false;
  el.feedback.textContent = '';
  el.feedback.className = 'feedback';
  renderPuzzle();
}

function renderPuzzle() {
  el.opBadge.textContent = OP_SYMBOL[puzzle.op];
  el.targetNumber.textContent = puzzle.target;
  el.tilesGrid.innerHTML = '';
  el.tilesGrid.className = 'tiles-grid grid-' + puzzle.tiles.length;

  puzzle.tiles.forEach(tile => {
    const btn = document.createElement('button');
    btn.className = 'tile';
    btn.dataset.id = tile.id;

    const valueSpan = document.createElement('div');
    valueSpan.className = 'tile-value';
    valueSpan.textContent = tile.value;
    btn.appendChild(valueSpan);

    if (puzzle.showDots) {
      const dots = document.createElement('div');
      dots.className = 'tile-dots';
      dots.textContent = '●'.repeat(tile.value);
      btn.appendChild(dots);
    }

    btn.addEventListener('click', () => onTileClick(tile.id));
    el.tilesGrid.appendChild(btn);
  });
}

function onTileClick(tileId) {
  if (locked) return;
  const tileEls = Array.from(el.tilesGrid.children);
  const tileEl = tileEls.find(t => Number(t.dataset.id) === tileId);

  if (selected.includes(tileId)) {
    selected = selected.filter(id => id !== tileId);
    tileEl.classList.remove('selected');
    return;
  }

  if (selected.length >= 2) return;

  playClick(profile);
  selected.push(tileId);
  tileEl.classList.add('selected');

  if (selected.length === 2) {
    evaluateSelection();
  }
}

function evaluateSelection() {
  puzzleAttempts += 1;
  const [idA, idB] = selected;
  const tileA = puzzle.tiles.find(t => t.id === idA);
  const tileB = puzzle.tiles.find(t => t.id === idB);
  const correct = isPairCorrect(tileA, tileB, puzzle.target, puzzle.op);

  if (correct) {
    locked = true;
    playCorrect(profile);
    el.feedback.textContent = pickPraise();
    el.feedback.className = 'feedback feedback-good';
    markTiles([idA, idB], 'correct-tile');

    const timeSec = (Date.now() - puzzleStartTime) / 1000;
    session.times.push(timeSec);
    session.puzzlesCompleted += 1;
    if (puzzleAttempts === 1) session.firstTryCorrect += 1;

    const starsEarned = puzzleAttempts === 1 ? 1 : 0;
    if (starsEarned) {
      el.starsCount.textContent = String(Number(el.starsCount.textContent) + 1);
    }

    renderSessionDots();
    setTimeout(nextPuzzle, 900);
  } else {
    playWrong(profile);
    el.feedback.textContent = "Not quite — try again!";
    el.feedback.className = 'feedback feedback-bad';
    markTiles([idA, idB], 'wrong-tile');
    setTimeout(() => {
      selected = [];
      Array.from(el.tilesGrid.children).forEach(t => t.classList.remove('selected', 'wrong-tile'));
    }, 500);
  }
}

function markTiles(ids, className) {
  Array.from(el.tilesGrid.children).forEach(t => {
    if (ids.includes(Number(t.dataset.id))) t.classList.add(className);
  });
}

const PRAISE = ["Great job! 🎉", "Awesome! ⭐", "You got it! 🙌", "Nice work! 🦉", "Super! ✨", "Brilliant! 🌟"];
function pickPraise() {
  return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}

function finishSession() {
  const accuracy = session.firstTryCorrect / session.puzzlesCompleted;
  const avgTimeSec = session.times.length ? session.times.reduce((a, b) => a + b, 0) / session.times.length : 0;

  const record = {
    date: Date.now(),
    levelId: session.levelId,
    puzzlesCompleted: session.puzzlesCompleted,
    firstTryCorrect: session.firstTryCorrect,
    avgTimeSec: Math.round(avgTimeSec * 10) / 10,
  };
  recordSession(profile, record);

  const levelChange = evaluateLeveling(profile);

  showSummary(accuracy, levelChange);
}

function showSummary(accuracy, levelChange) {
  const starCount = accuracy >= 0.9 ? 3 : accuracy >= 0.6 ? 2 : 1;
  el.summaryStars.textContent = '⭐'.repeat(starCount) + '☆'.repeat(3 - starCount);
  el.summaryText.textContent = `You got ${session.firstTryCorrect} out of ${session.puzzlesCompleted} right away!`;

  if (levelChange === 'up') {
    playLevelUp(profile);
    const level = getLevel(profile.levelId);
    el.summaryMascot.textContent = '🚀';
    el.summaryLevelChange.textContent = `Level Up! Now on Level ${level.id}: ${level.label}`;
  } else if (levelChange === 'down') {
    el.summaryMascot.textContent = '💪';
    const level = getLevel(profile.levelId);
    el.summaryLevelChange.textContent = `Let's practice more at Level ${level.id}: ${level.label}`;
  } else {
    el.summaryMascot.textContent = '🎉';
    el.summaryLevelChange.textContent = '';
  }

  showScreen('summary');
}

// ---------- top bar ----------

el.btnMute.addEventListener('click', () => {
  profile.muted = !profile.muted;
  saveProfile(profile);
  el.btnMute.textContent = profile.muted ? '🔇' : '🔊';
});

el.btnPlay.addEventListener('click', startSession);
el.btnPlayAgain.addEventListener('click', startSession);
el.btnHome.addEventListener('click', () => { refreshStartScreen(); showScreen('start'); });

// ---------- parent dashboard ----------

el.btnParent.addEventListener('click', openParentDashboard);
el.btnCloseParent.addEventListener('click', () => el.parentModal.classList.add('hidden'));
el.parentModal.addEventListener('click', (e) => { if (e.target === el.parentModal) el.parentModal.classList.add('hidden'); });

function openParentDashboard() {
  el.inputName.value = profile.name;
  const level = getLevel(profile.levelId);
  const stage = getStage(level.stage);
  el.statLevel.textContent = `${level.id} — ${level.label}`;
  el.statStage.textContent = stage.name;
  el.statTotal.textContent = profile.totalPuzzlesSolved;

  const recent = profile.sessions.slice(-5);
  if (recent.length) {
    const avgAcc = recent.reduce((s, r) => s + r.firstTryCorrect / r.puzzlesCompleted, 0) / recent.length;
    el.statAccuracy.textContent = Math.round(avgAcc * 100) + '%';
  } else {
    el.statAccuracy.textContent = '—';
  }

  el.selectLevel.innerHTML = '';
  LEVELS.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.id}. ${l.label} (${getStage(l.stage).name})`;
    if (l.id === profile.levelId) opt.selected = true;
    el.selectLevel.appendChild(opt);
  });

  drawProgressChart();
  el.parentModal.classList.remove('hidden');
}

function drawProgressChart() {
  const ctx = el.progressChart.getContext('2d');
  const w = el.progressChart.width, h = el.progressChart.height;
  ctx.clearRect(0, 0, w, h);

  const data = profile.sessions.slice(-15);
  if (!data.length) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Play a few sessions to see progress here.', 10, h / 2);
    return;
  }

  const padding = 24;
  const barWidth = (w - padding * 2) / data.length;

  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - 4, h - padding);
  ctx.stroke();

  data.forEach((s, i) => {
    const acc = s.firstTryCorrect / s.puzzlesCompleted;
    const barHeight = acc * (h - padding * 2);
    const x = padding + i * barWidth + 4;
    const y = h - padding - barHeight;
    ctx.fillStyle = acc >= 0.8 ? '#4ade80' : acc >= 0.5 ? '#fbbf24' : '#f87171';
    ctx.fillRect(x, y, barWidth - 8, barHeight);
  });

  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.fillText('Level ' + (data[0] ? data[0].levelId : ''), padding, 14);
}

el.btnSaveParent.addEventListener('click', () => {
  const newName = el.inputName.value.trim();
  profile.name = newName || 'Explorer';
  profile.levelId = Number(el.selectLevel.value);
  saveProfile(profile);
  refreshStartScreen();
  el.parentModal.classList.add('hidden');
});

el.btnResetProgress.addEventListener('click', () => {
  if (confirm('This will erase all saved progress on this device. Are you sure?')) {
    profile = resetProfile();
    refreshStartScreen();
    el.parentModal.classList.add('hidden');
  }
});

// ---------- init ----------
refreshStartScreen();
showScreen('start');
