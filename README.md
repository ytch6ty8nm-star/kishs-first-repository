# Kakooma Kids 🦉

A Kakooma-style number puzzle game built for one player: a 5-year-old, with
the goal of building arithmetic fluency toward a 2nd-grade (~age 7) level
over the course of a year.

**[Try it]** — open `index.html` in a browser, or serve the folder locally:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

It's a static site (plain HTML/CSS/JS, no build step, no dependencies, no
network calls, no accounts). Works offline, on a phone, tablet, or laptop.

## How to play

Each puzzle shows a **target number** and a grid of number tiles. Tap two
tiles that combine (add, subtract, or multiply, depending on the level) to
make the target. Get it right and you move to the next puzzle; a session is
10 puzzles (~5 minutes), ending with a star rating.

## Curriculum design

The game is organized into **14 levels across 7 stages**, each one tightening
the number range, adding an operation, or removing scaffolding (like the dot
counters under numbers for pre-readers):

| Stage | Levels | Focus |
|---|---|---|
| Foundations | 1–2 | Counting & number sense within 5, with dot supports |
| Adding to 10 | 3–4 | Addition facts within 10 |
| Adding & Subtracting to 20 | 5–7 | Addition, then mixed addition/subtraction within 20 |
| Speedy to 20 | 8 | Fluency and speed on facts within 20 |
| Multiplication Start | 9–10 | Times tables 2, 5, 10 via skip counting |
| Multiplication Mastery | 11–12 | Times tables up to 10 |
| Math Mastery to 100 | 13–14 | Mixed addition/subtraction/multiplication within 100 |

This targets **arithmetic fact fluency** specifically — the part of math a
Kakooma-style puzzle is good for. A full 7-year-old (2nd grade) curriculum
also includes place value, measurement, time, money, and shapes, which are
outside the scope of this puzzle format and would need a different game or
activities alongside this one.

## Adaptive difficulty

There's no fixed weekly schedule — the game watches actual performance and
moves the child through the levels at whatever pace fits:

- After each 10-puzzle session, it looks at the **last two sessions played
  at the current level**.
- If both sessions were ≥80% correct on the first try → **level up**.
- If both were <40% correct → **level down** one step, for more practice.
- Otherwise it holds steady at the current level.

This means a fast learner can blow through early levels in days, while a
level that needs more repetition just gets more repetition, without a
parent having to manually tune anything.

## Parent dashboard

The gear icon opens a dashboard (no password — this is a private,
single-child, on-device app) showing:

- Current level and stage
- Total puzzles solved and recent accuracy
- A bar chart of accuracy across recent sessions
- A dropdown to manually jump to any level (useful after a break, or to
  match what they're learning in school)
- A reset button to clear all progress

All data is stored in the browser's `localStorage` only — nothing leaves
the device.

## Project structure

```
index.html          Screens: start, game, session summary, parent dashboard
css/style.css        Kid-friendly styling (big tiles, bright colors, animations)
js/curriculum.js     The 7 stages / 14 levels definition
js/puzzle.js          Puzzle generation (unique-solution board builder)
js/storage.js         localStorage persistence + adaptive leveling logic
js/audio.js            Simple synthesized sound effects (no audio files)
js/app.js               Screen flow, game loop, parent dashboard wiring
```

## Extending it

Ideas for later, not yet built:
- A division mode (Kakooma traditionally sticks to addition/multiplication;
  subtraction is included here as an extension, division was left out to
  keep the mechanic clear for young kids)
- Multiple child profiles
- A daily streak / reminder system
