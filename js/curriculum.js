// Curriculum: 7 stages, 20 levels, taking a beginner (age ~5) toward
// age-7 (2nd/3rd grade) arithmetic fluency. Each level tightens the number
// range, adds an operation, or removes visual scaffolding (dots) by a
// smaller step than a coarser curriculum would, so progression feels
// gradual rather than jumpy.
//
// Every level carries a `milestone` (a plain-language skill achieved) and
// a rough `gradeLevel` tag, shown to parents when a level is mastered.
//
// The adaptive engine in app.js moves a child through these levels based
// on real performance rather than a fixed calendar, so "within a year" is
// a target pace, not a hard schedule.

const STAGES = [
  { id: 'foundations', name: 'Foundations',                description: 'Counting and number sense within 6' },
  { id: 'add10',        name: 'Adding to 10',                description: 'Addition facts within 10' },
  { id: 'add20',        name: 'Adding & Subtracting to 20',  description: 'Addition and subtraction within 20' },
  { id: 'fluency20',    name: 'Speedy to 20',                description: 'Fast, fluent facts within 20' },
  { id: 'multiply',     name: 'Multiplication Start',        description: 'Times tables 2, 5, 10 by skip counting' },
  { id: 'multfluent',   name: 'Multiplication Mastery',      description: 'Times tables up to 10' },
  { id: 'mastery',      name: 'Math Mastery to 100',         description: 'Mixed operations within 100' },
];

const LEVELS = [
  { id: 1,  stage: 'foundations', label: 'Counting Buddies',     operations: ['add'], operandMin: 1, operandMax: 3,  targetMin: 2, targetMax: 4,   gridSize: 4, showDots: true,
    milestone: 'Counts and adds small numbers with picture support', gradeLevel: 'Pre-K' },
  { id: 2,  stage: 'foundations', label: 'Five Friends',         operations: ['add'], operandMin: 1, operandMax: 4,  targetMin: 2, targetMax: 5,   gridSize: 4, showDots: true,
    milestone: 'Adds numbers within 5 using dot supports', gradeLevel: 'Pre-K' },
  { id: 3,  stage: 'foundations', label: 'High Five',            operations: ['add'], operandMin: 1, operandMax: 5,  targetMin: 2, targetMax: 6,   gridSize: 5, showDots: true,
    milestone: 'Adds numbers within 6', gradeLevel: 'Kindergarten' },
  { id: 4,  stage: 'add10',       label: 'Up to Eight',          operations: ['add'], operandMin: 1, operandMax: 5,  targetMin: 3, targetMax: 8,   gridSize: 5,
    milestone: 'Adds numbers within 8 without picture support', gradeLevel: 'Kindergarten' },
  { id: 5,  stage: 'add10',       label: 'Up to Ten',            operations: ['add'], operandMin: 1, operandMax: 6,  targetMin: 3, targetMax: 9,   gridSize: 5,
    milestone: 'Adds numbers within 9', gradeLevel: 'Kindergarten' },
  { id: 6,  stage: 'add10',       label: 'Perfect Ten',          operations: ['add'], operandMin: 1, operandMax: 8,  targetMin: 4, targetMax: 10,  gridSize: 6,
    milestone: 'Fluently adds numbers within 10', gradeLevel: 'Kindergarten' },
  { id: 7,  stage: 'add20',       label: 'Fifteen Trail',        operations: ['add'], operandMin: 1, operandMax: 9,  targetMin: 5, targetMax: 15,  gridSize: 6,
    milestone: 'Adds numbers within 15', gradeLevel: 'Grade 1' },
  { id: 8,  stage: 'add20',       label: 'Twenty Trail',         operations: ['add'], operandMin: 1, operandMax: 10, targetMin: 6, targetMax: 20,  gridSize: 6,
    milestone: 'Adds numbers within 20', gradeLevel: 'Grade 1' },
  { id: 9,  stage: 'add20',       label: 'Take-Away Trail',      operations: ['add','subtract'], operandMin: 1, operandMax: 12, targetMin: 2, targetMax: 18, gridSize: 7,
    milestone: 'Adds and subtracts within 18', gradeLevel: 'Grade 1' },
  { id: 10, stage: 'add20',       label: 'Twenty Champs',        operations: ['add','subtract'], operandMin: 1, operandMax: 15, targetMin: 2, targetMax: 20, gridSize: 7,
    milestone: 'Adds and subtracts within 20', gradeLevel: 'Grade 1' },
  { id: 11, stage: 'fluency20',   label: 'Quick Twenty',         operations: ['add','subtract'], operandMin: 1, operandMax: 16, targetMin: 2, targetMax: 20, gridSize: 8, timeChallenge: true,
    milestone: 'Solves addition/subtraction within 20 quickly', gradeLevel: 'Grade 1-2' },
  { id: 12, stage: 'fluency20',   label: 'Speedy Twenty',        operations: ['add','subtract'], operandMin: 1, operandMax: 18, targetMin: 2, targetMax: 20, gridSize: 8, timeChallenge: true,
    milestone: 'Full fluency with facts within 20', gradeLevel: 'Grade 2' },
  { id: 13, stage: 'multiply',    label: 'Skip Counting',        operations: ['multiply'], factors: [2, 5, 10],       targetMax: 50, gridSize: 6,
    milestone: 'Multiplies using the 2, 5, and 10 times tables', gradeLevel: 'Grade 2' },
  { id: 14, stage: 'multiply',    label: 'Times Tables Start',   operations: ['multiply'], factors: [2, 3, 4, 5, 10], targetMax: 60, gridSize: 7,
    milestone: 'Multiplies using times tables 2, 3, 4, 5, 10', gradeLevel: 'Grade 2' },
  { id: 15, stage: 'multiply',    label: 'Times Tables Building',operations: ['multiply'], factors: [2, 3, 4, 5, 6, 10], targetMax: 70, gridSize: 7,
    milestone: 'Multiplies using times tables through 6', gradeLevel: 'Grade 2-3' },
  { id: 16, stage: 'multfluent',  label: 'Times Tables Grow',    operations: ['multiply'], factors: [2, 3, 4, 5, 6],   targetMax: 80, gridSize: 7,
    milestone: 'Fluent with times tables through 6, larger products', gradeLevel: 'Grade 3' },
  { id: 17, stage: 'multfluent',  label: 'Times Tables Master',  operations: ['multiply'], factors: [2, 3, 4, 5, 6, 7, 8, 9, 10], targetMax: 100, gridSize: 8,
    milestone: 'Fluent with times tables 1 through 10', gradeLevel: 'Grade 3' },
  { id: 18, stage: 'mastery',     label: 'Fifty Club',           operations: ['add','subtract'], operandMin: 5, operandMax: 30, targetMin: 10, targetMax: 50, gridSize: 8,
    milestone: 'Adds and subtracts within 50', gradeLevel: 'Grade 2' },
  { id: 19, stage: 'mastery',     label: 'Hundred Club',         operations: ['add','subtract'], operandMin: 5, operandMax: 50, targetMin: 10, targetMax: 100, gridSize: 8,
    milestone: 'Adds and subtracts within 100', gradeLevel: 'Grade 2-3' },
  { id: 20, stage: 'mastery',     label: 'Math Champion',        operations: ['add','subtract','multiply'], operandMin: 2, operandMax: 50, targetMin: 5, targetMax: 100, factors: [2, 3, 4, 5, 10], gridSize: 9, timeChallenge: true,
    milestone: 'Mixes addition, subtraction, and multiplication within 100', gradeLevel: 'Grade 3' },
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
