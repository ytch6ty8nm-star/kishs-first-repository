// Local progress persistence. Everything stays on-device (localStorage) —
// no accounts, no network calls.

const STORAGE_KEY = 'kakooma-kids-profile-v2';

function defaultProfile() {
  return {
    name: 'Explorer',
    levelId: 1,
    muted: false,
    totalPuzzlesSolved: 0,
    sessions: [],   // { date, levelId, puzzlesCompleted, firstTryCorrect, avgTimeSec }
    milestones: [], // { levelId, label, skill, gradeLevel, dateAchieved, sessionsToMaster, avgAccuracy, avgTimeSec }
    createdAt: Date.now(),
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return migrateOldProfile();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultProfile(), parsed);
  } catch (e) {
    return defaultProfile();
  }
}

// One-time migration from the pre-milestones (v1) 14-level save, if present,
// so existing progress isn't lost when this version ships.
function migrateOldProfile() {
  try {
    const raw = localStorage.getItem('kakooma-kids-profile-v1');
    if (!raw) return defaultProfile();
    const old = JSON.parse(raw);
    const migrated = Object.assign(defaultProfile(), old, { milestones: [] });
    saveProfile(migrated);
    return migrated;
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
  if (profile.sessions.length > 200) profile.sessions.shift();
  profile.totalPuzzlesSolved += sessionResult.puzzlesCompleted;
  saveProfile(profile);
}

// Adaptive leveling: look at the last two sessions played at the child's
// CURRENT level and decide whether to advance, hold, or step back.
// Returns 'up' | 'down' | 'complete' | null, and records a milestone
// whenever a level is mastered for the first time.
function evaluateLeveling(profile) {
  const atLevel = profile.sessions.filter(s => s.levelId === profile.levelId);
  const lastTwo = atLevel.slice(-2);
  if (lastTwo.length < 2) return null;

  const avgAccuracy = lastTwo.reduce((sum, s) => sum + s.firstTryCorrect / s.puzzlesCompleted, 0) / lastTwo.length;
  const avgTime = lastTwo.reduce((sum, s) => sum + s.avgTimeSec, 0) / lastTwo.length;

  if (avgAccuracy >= 0.8) {
    const level = getLevel(profile.levelId);
    profile.milestones = profile.milestones || [];
    if (!profile.milestones.some(m => m.levelId === level.id)) {
      profile.milestones.push({
        levelId: level.id,
        label: level.label,
        skill: level.milestone,
        gradeLevel: level.gradeLevel,
        dateAchieved: Date.now(),
        sessionsToMaster: atLevel.length,
        avgAccuracy: Math.round(avgAccuracy * 100),
        avgTimeSec: Math.round(avgTime * 10) / 10,
      });
    }
    if (profile.levelId < maxLevelId()) {
      profile.levelId += 1;
      saveProfile(profile);
      return 'up';
    }
    saveProfile(profile);
    return 'complete';
  }

  if (avgAccuracy < 0.4 && profile.levelId > 1) {
    profile.levelId -= 1;
    saveProfile(profile);
    return 'down';
  }
  return null;
}

function getPracticeDays(profile) {
  return new Set(profile.sessions.map(s => new Date(s.date).toDateString()));
}

// Current consecutive-day practice streak. Counts today if already
// played, otherwise anchors on yesterday so the streak doesn't drop to
// zero before the child has had a chance to play today.
function computeStreak(profile) {
  const days = getPracticeDays(profile);
  if (!days.size) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toDateString())) return 0;
  }

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
