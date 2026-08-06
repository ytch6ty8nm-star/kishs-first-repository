// Curriculum: 7 stages, 14 levels, taking a beginner (age ~5) toward
// age-7 (2nd grade) arithmetic fluency. Each level tightens the number
// range, adds an operation, or removes visual scaffolding (dots).
//
// The adaptive engine in app.js moves a child through these levels based
// on real performance rather than a fixed calendar, so "within a year" is
// a target pace, not a hard schedule.

const STAGES = [
  { id: 'foundations', name: 'Foundations',                description: 'Counting and number sense within 5' },
  { id: 'add10',        name: 'Adding to 10',                description: 'Addition facts within 10' },
  { id: 'add20',        name: 'Adding & Subtracting to 20',  description: 'Addition and subtraction within 20' },
  { id: 'fluency20',    name: 'Speedy to 20',                description: 'Fast, fluent facts within 20' },
  { id: 'multiply',     name: 'Multiplication Start',        description: 'Times tables 2, 5, 10 by skip counting' },
  { id: 'multfluent',   name: 'Multiplication Mastery',      description: 'Times tables up to 10' },
  { id: 'mastery',      name: 'Math Mastery to 100',         description: 'Mixed operations within 100 (~2nd grade level)' },
];

const LEVELS = [
  { id: 1,  stage: 'foundations', label: 'Counting Buddies',  operations: ['add'],      operandMin: 1, operandMax: 4,  targetMin: 2,  targetMax: 5,   gridSize: 4, showDots: true },
  { id: 2,  stage: 'foundations', label: 'Five Friends',      operations: ['add'],      operandMin: 1, operandMax: 5,  targetMin: 2,  targetMax: 6,   gridSize: 5, showDots: true },
  { id: 3,  stage: 'add10',       label: 'Up to Ten',         operations: ['add'],      operandMin: 1, operandMax: 6,  targetMin: 3,  targetMax: 9,   gridSize: 5, showDots: true },
  { id: 4,  stage: 'add10',       label: 'Perfect Ten',       operations: ['add'],      operandMin: 1, operandMax: 8,  targetMin: 4,  targetMax: 10,  gridSize: 6 },
  { id: 5,  stage: 'add20',       label: 'Twenty Trail',      operations: ['add'],      operandMin: 1, operandMax: 10, targetMin: 5,  targetMax: 15,  gridSize: 6 },
  { id: 6,  stage: 'add20',       label: 'Take-Away Trail',   operations: ['add','subtract'], operandMin: 1, operandMax: 12, targetMin: 2, targetMax: 18, gridSize: 7 },
  { id: 7,  stage: 'add20',       label: 'Twenty Champs',     operations: ['add','subtract'], operandMin: 1, operandMax: 15, targetMin: 2, targetMax: 20, gridSize: 7 },
  { id: 8,  stage: 'fluency20',   label: 'Speedy Twenty',     operations: ['add','subtract'], operandMin: 1, operandMax: 18, targetMin: 2, targetMax: 20, gridSize: 8, timeChallenge: true },
  { id: 9,  stage: 'multiply',    label: 'Skip Counting',     operations: ['multiply'], factors: [2, 5, 10],             targetMax: 50,  gridSize: 6 },
  { id: 10, stage: 'multiply',    label: 'Times Tables Start',operations: ['multiply'], factors: [2, 3, 4, 5, 10],       targetMax: 60,  gridSize: 7 },
  { id: 11, stage: 'multfluent',  label: 'Times Tables Grow', operations: ['multiply'], factors: [2, 3, 4, 5, 6],        targetMax: 80,  gridSize: 7 },
  { id: 12, stage: 'multfluent',  label: 'Times Tables Master',operations: ['multiply'],factors: [2, 3, 4, 5, 6, 7, 8, 9, 10], targetMax: 100, gridSize: 8 },
  { id: 13, stage: 'mastery',     label: 'Hundred Club',      operations: ['add','subtract'], operandMin: 5, operandMax: 50, targetMin: 10, targetMax: 100, gridSize: 8 },
  { id: 14, stage: 'mastery',     label: 'Math Champion',     operations: ['add','subtract','multiply'], operandMin: 2, operandMax: 50, targetMin: 5, targetMax: 100, factors: [2, 3, 4, 5, 10], gridSize: 9, timeChallenge: true },
];

function getLevel(id) {
  return LEVELS.find(l => l.id === id) || LEVELS[0];
}

function getStage(stageId) {
  return STAGES.find(s => s.id === stageId) || STAGES[0];
}

function maxLevelId() {
  return LEVELS[LEVELS.length - 1].id;
}
