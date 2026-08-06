# Kakooma Kids 🦉

A Kakooma-style number puzzle game built for one player: a 5-year-old, with
the goal of building arithmetic fluency toward a 2nd/3rd-grade (~age 7+)
level over the course of a year.

**[Try it]** — the whole game is a single self-contained `index.html` file
(HTML, CSS, and JS all inlined, icon embedded as a data URI). Double-click
it to open in any browser, or send it straight to a phone — no server, no
build step, no dependencies, no accounts, and no internet connection
required at all, since there's nothing external to fetch.

## How to play

Each puzzle shows a **target number** and a grid of number tiles. Tap two
tiles that combine (add, subtract, or multiply, depending on the level) to
make the target. Get it right and you move to the next puzzle; a session is
10 puzzles (~5 minutes), ending with a star rating.

## Playing it on an iPhone

Because it's one plain HTML file with nothing external to load, the
simplest path skips web hosting entirely:

1. Get `index.html` onto the phone — AirDrop it from a Mac, email it to
   yourself, or save it via the Files app (e.g. from iCloud Drive/Dropbox).
2. Open it from the **Files app** — it opens in Safari automatically.
3. Tap the **Share** button → **Add to Home Screen** → **Add**.
4. A "Kakooma" icon appears on the home screen. Opening it launches
   full-screen, like a native app — and since the file lives on the phone,
   it works with wifi fully off.

No Apple Developer account, no Xcode, no App Store review, and no GitHub
Pages needed.

**Alternative — a shareable link.** If you'd rather send a URL than a file
(e.g. to open on multiple devices without AirDropping each time), you can
still host this same `index.html` anywhere that serves static files —
GitHub Pages, Netlify, or similar — since it's just one file. The
install steps are the same (open the URL in Safari → Share → Add to Home
Screen); the only difference is step 1 is a link instead of a local file.

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

Everything lives in **one file**, `index.html`, for simplicity of
deployment — no separate CSS/JS files, manifest, or service worker to keep
in sync. Inside it, in order:

- Markup for the four screens: start, game, session summary, parent dashboard
- `<style>` — kid-friendly styling (big tiles, bright colors, animations)
- `<script>` blocks, in dependency order:
  - **curriculum** — the 7 stages / 20 levels, each with a milestone + grade tag
  - **puzzle** — puzzle generation (unique-solution board builder)
  - **storage** — localStorage persistence, adaptive leveling, milestones, streaks
  - **audio** — simple synthesized sound effects (no audio files)
  - **app** — screen flow, game loop, parent dashboard wiring

## Extending it

Ideas for later, not yet built:
- A division mode (Kakooma traditionally sticks to addition/multiplication;
  subtraction is included here as an extension, division was left out to
  keep the mechanic clear for young kids)
- Multiple child profiles
- A daily reminder (iOS PWA push notifications are possible on iOS 16.4+,
  but need a small backend to send them — out of scope for this on-device,
  no-server version)
