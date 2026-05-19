# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanilla JavaScript implementation of a Decision Tree classifier with HTML5 Canvas visualization. No external dependencies, no build step — open `index.html` directly in a browser to run.

## Running the Project

Open `index.html` in a browser:
- Click **"нажми"** — initializes the dataset and builds the tree
- Click **"Нарисуй"** — renders the decision boundary visualization

## Architecture

Three files, flat structure:

```
index.html  →  canvas.js  →  tree.js
```

- **`tree.js`** — Decision Tree algorithm (CART with Gini impurity). Exports: `buildTree`, `predict`, `split`, `gini`, `findBestSplit`, `findMajorClass`.
- **`canvas.js`** — Visualization and UI event handling. Generates the dataset, calls `buildTree`, traverses the resulting tree to collect split thresholds, then draws axes/thresholds/points and does pixel-by-pixel decision boundary coloring via `colourResults()`.
- **`index.html`** — Two buttons and a 300×300 `<canvas>`. Loads `canvas.js` as an ES6 module.

## Algorithm Details

- Splitting criterion: Gini impurity (weighted sum over left/right branches)
- Split candidates: midpoints between consecutive unique values for each feature
- Stopping conditions: `depth >= 5`, `samples < 3`, or pure split (Gini = 0)
- Prediction: tree traversal using `node.feature` and `node.threshold` at each node; leaf returns `node.label`

## Conventions

- All variable names, comments, and UI strings are in **Russian**
- ES6 modules (`import`/`export`) — no bundler involved

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
