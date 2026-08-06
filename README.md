# Kakooma Kids 🦉

A Kakooma-style number puzzle game built for one player: a 5-year-old, with
the goal of building arithmetic fluency toward a 2nd/3rd-grade (~age 7+)
level over the course of a year.

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

## Installing it as an iPhone app

This is built as a **PWA (Progressive Web App)** rather than a native App
Store app — for a personal, single-child game that's the right tradeoff: no
Apple Developer account ($99/yr), no Xcode, no App Store review, and it
still gets a real home-screen icon, full-screen play with no Safari address
bar, and offline play after the first load.

1. **Host the files somewhere with HTTPS.** The easiest option, since this
   is already a GitHub repo: go to **Settings → Pages** on this repo, set
   **Source: Deploy from a branch**, branch **main**, folder **/ (root)**,
   and save. GitHub gives you a free URL like
   `https://<your-username>.github.io/kishs-first-repository/`.
   (A plain `file://` URL on the phone won't work for the offline/install
   part — Safari only allows the service worker that powers offline play
   over `https://` or `localhost`.)
2. On the iPhone, open that URL in **Safari** (must be Safari, not Chrome —
   only Safari can install PWAs to the home screen on iOS).
3. Tap the **Share** button → **Add to Home Screen** → **Add**.
4. A "Kakooma" icon appears on the home screen. Opening it launches
   full-screen, like a native app, and it keeps working without wifi once
   it's been opened at least once while online.

If you ever change the code and push it, the app updates itself in the
background next time it's opened — no reinstall needed. (If a change
doesn't seem to show up, bump the `CACHE_NAME` version string at the top of
`sw.js` — that forces the old cached copy to be replaced.)

## Curriculum design

The game is organized into **20 levels across 7 stages**, each one
tightening the number range, adding an operation, or removing scaffolding
(like the dot counters under numbers for pre-readers) by a small step, so
progression feels gradual rather than jumpy:

| Stage | Levels | Focus |
|---|---|---|
| Foundations | 1–3 | Counting & number sense within 6, with dot supports |
| Adding to 10 | 4–6 | Addition facts within 10 |
| Adding & Subtracting to 20 | 7–10 | Addition, then mixed addition/subtraction within 20 |
| Speedy to 20 | 11–12 | Fluency and speed on facts within 20 |
| Multiplication Start | 13–15 | Times tables 2, 5, 10 → 6, via skip counting |
| Multiplication Mastery | 16–17 | Times tables up to 10 |
| Math Mastery to 100 | 18–20 | Mixed addition/subtraction/multiplication within 100 |

This targets **arithmetic fact fluency** specifically — the part of math a
Kakooma-style puzzle is good for. A full 7-year-old (2nd/3rd grade)
curriculum also includes place value, measurement, time, money, and shapes,
which are outside the scope of this puzzle format and would need a
different activity alongside this one.

## Adaptive difficulty

There's no fixed weekly schedule — the game watches actual performance and
moves the child through the levels at whatever pace fits:

- After each 10-puzzle session, it looks at the **last two sessions played
  at the current level**.
- If both sessions were ≥80% correct on the first try → **level up**, and a
  **milestone** is recorded for that level (see below).
- If both were <40% correct → **level down** one step, for more practice.
- Otherwise it holds steady at the current level.
- Mastering the 20th level records a "Program Complete" milestone.

This means a fast learner can blow through early levels in days, while a
level that needs more repetition just gets more repetition, without a
parent having to manually tune anything.

## Progress & milestone tracking

Every level carries a plain-language skill (e.g. *"Adds and subtracts
within 20"*) and a rough grade-level tag (e.g. *"Grade 1"*). The first time
a level is mastered:

- A **milestone unlocked** banner shows on the session-summary screen with
  the skill just achieved.
- It's logged permanently to the **parent dashboard** with the date,
  accuracy, and how many sessions it took to master.

The parent dashboard (gear icon, no password — this is a private,
single-child, on-device app) shows:

- Current level (X / 20) and stage
- Total puzzles solved and recent accuracy
- **Day streak** — consecutive days practiced
- **Milestones** achieved (X / 20), with a scrollable timeline of every
  skill mastered so far, when, and how well
- A bar chart of accuracy across recent sessions
- A dropdown to manually jump to any level (useful after a break, or to
  match what they're learning in school)
- A reset button to clear all progress

All data is stored in the browser's `localStorage` only — nothing leaves
the device, and nothing requires an account.

## Project structure

```
index.html           Screens: start, game, session summary, parent dashboard
manifest.json         PWA metadata (name, icons, colors) for "Add to Home Screen"
sw.js                  Service worker: caches assets for offline play
icons/                 App icon at the sizes iOS/Android expect
css/style.css          Kid-friendly styling (big tiles, bright colors, animations)
js/curriculum.js       The 7 stages / 20 levels, each with a milestone + grade tag
js/puzzle.js           Puzzle generation (unique-solution board builder)
js/storage.js          localStorage persistence, adaptive leveling, milestones, streaks
js/audio.js            Simple synthesized sound effects (no audio files)
js/app.js              Screen flow, game loop, parent dashboard wiring
```

## Extending it

Ideas for later, not yet built:
- A division mode (Kakooma traditionally sticks to addition/multiplication;
  subtraction is included here as an extension, division was left out to
  keep the mechanic clear for young kids)
- Multiple child profiles
- A daily reminder (iOS PWA push notifications are possible on iOS 16.4+,
  but need a small backend to send them — out of scope for this on-device,
  no-server version)
