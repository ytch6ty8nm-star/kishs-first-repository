// Tiny synth for feedback sounds — no external audio files needed.

let audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  return audioCtx;
}

function playTone(freq, startTime, duration, type = 'sine', gain = 0.2) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
  g.gain.setValueAtTime(0, ctx.currentTime + startTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + startTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration + 0.05);
}

function isMuted(profile) {
  return profile && profile.muted;
}

function playCorrect(profile) {
  if (isMuted(profile)) return;
  try {
    playTone(523.25, 0, 0.15, 'triangle');
    playTone(659.25, 0.1, 0.15, 'triangle');
    playTone(783.99, 0.2, 0.25, 'triangle');
  } catch (e) {}
}

function playWrong(profile) {
  if (isMuted(profile)) return;
  try {
    playTone(220, 0, 0.2, 'sine', 0.15);
  } catch (e) {}
}

function playLevelUp(profile) {
  if (isMuted(profile)) return;
  try {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => playTone(f, i * 0.12, 0.2, 'triangle'));
  } catch (e) {}
}

function playClick(profile) {
  if (isMuted(profile)) return;
  try {
    playTone(400, 0, 0.06, 'square', 0.08);
  } catch (e) {}
}
