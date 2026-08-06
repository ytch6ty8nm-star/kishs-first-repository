// Puzzle generation for the Kakooma-style board: a target number plus a
// grid of tiles, exactly one pair of which combines (via the puzzle's
// operation) to equal the target.

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOperation(level) {
  const ops = level.operations;
  return ops[randInt(0, ops.length - 1)];
}

function generateCorrectPair(level, op) {
  const attempts = 50;
  if (op === 'add') {
    const target = randInt(level.targetMin, level.targetMax);
    for (let i = 0; i < attempts; i++) {
      const a = randInt(level.operandMin, Math.min(level.operandMax, target - level.operandMin));
      const b = target - a;
      if (b >= level.operandMin && b <= level.operandMax) return { target, a, b, op };
    }
    return null;
  }
  if (op === 'subtract') {
    const target = randInt(level.targetMin, level.targetMax);
    for (let i = 0; i < attempts; i++) {
      const a = randInt(level.operandMin + target, level.operandMax);
      const b = a - target;
      if (b >= level.operandMin && b <= level.operandMax) return { target, a, b, op };
    }
    return null;
  }
  if (op === 'multiply') {
    const factors = level.factors;
    for (let i = 0; i < attempts; i++) {
      const a = factors[randInt(0, factors.length - 1)];
      const b = randInt(2, 10);
      const target = a * b;
      if (target <= level.targetMax) return { target, a, b, op };
    }
    return null;
  }
  return null;
}

function generateDistractor(level, op, existingValues) {
  for (let i = 0; i < 30; i++) {
    let v;
    if (op === 'multiply') {
      v = randInt(2, 10);
    } else {
      v = randInt(level.operandMin, level.operandMax);
    }
    return v;
  }
  return randInt(1, 10);
}

function countPairsEqualTarget(tiles, target, op) {
  let count = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const x = tiles[i].value, y = tiles[j].value;
      let result;
      if (op === 'add') result = x + y;
      else if (op === 'subtract') result = Math.abs(x - y);
      else if (op === 'multiply') result = x * y;
      if (result === target) count++;
    }
  }
  return count;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generates a puzzle with a unique solution when possible. Retries a
// bounded number of times; if it can't find a clean unique-solution
// board it falls back to the best attempt so the game never hangs.
function generatePuzzle(level) {
  let best = null;
  for (let attempt = 0; attempt < 25; attempt++) {
    const op = pickOperation(level);
    const pair = generateCorrectPair(level, op);
    if (!pair) continue;

    const tiles = [
      { id: 0, value: pair.a, correct: true },
      { id: 1, value: pair.b, correct: true },
    ];
    for (let k = 2; k < level.gridSize; k++) {
      tiles.push({ id: k, value: generateDistractor(level, op, tiles.map(t => t.value)), correct: false });
    }

    const pairCount = countPairsEqualTarget(tiles, pair.target, op);
    const puzzle = {
      target: pair.target,
      op,
      tiles: shuffle(tiles),
      showDots: !!level.showDots,
      timeChallenge: !!level.timeChallenge,
    };
    if (pairCount === 1) return puzzle;
    if (!best) best = puzzle;
  }
  return best;
}

function isPairCorrect(tileA, tileB, target, op) {
  let result;
  if (op === 'add') result = tileA.value + tileB.value;
  else if (op === 'subtract') result = Math.abs(tileA.value - tileB.value);
  else if (op === 'multiply') result = tileA.value * tileB.value;
  return result === target;
}
