// Local progress persistence. Everything stays on-device (localStorage) —
// no accounts, no network calls.

const STORAGE_KEY = 'kakooma-kids-profile-v1';

function defaultProfile() {
  return {
    name: 'Explorer',
    levelId: 1,
    muted: false,
    totalPuzzlesSolved: 0,
    sessions: [], // { date, levelId, puzzlesCompleted, firstTryCorrect, attempts, avgTimeSec }
    createdAt: Date.now(),
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultProfile(), parsed);
  } catch (e) {
    return defaultProfile();
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    // storage unavailable (private browsing, etc.) - fail silently, game still works in-memory
  }
}

function resetProfile() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultProfile();
}

function recordSession(profile, sessionResult) {
  profile.sessions.push(sessionResult);
  if (profile.sessions.length > 100) profile.sessions.shift();
  profile.totalPuzzlesSolved += sessionResult.puzzlesCompleted;
  saveProfile(profile);
}

// Adaptive leveling: look at the last two sessions played at the child's
// CURRENT level and decide whether to advance, hold, or step back.
function evaluateLeveling(profile) {
  const atLevel = profile.sessions.filter(s => s.levelId === profile.levelId);
  const lastTwo = atLevel.slice(-2);
  if (lastTwo.length < 2) return null;

  const avgAccuracy = lastTwo.reduce((sum, s) => sum + s.firstTryCorrect / s.puzzlesCompleted, 0) / lastTwo.length;

  if (avgAccuracy >= 0.8 && profile.levelId < maxLevelId()) {
    profile.levelId += 1;
    saveProfile(profile);
    return 'up';
  }
  if (avgAccuracy < 0.4 && profile.levelId > 1) {
    profile.levelId -= 1;
    saveProfile(profile);
    return 'down';
  }
  return null;
}
