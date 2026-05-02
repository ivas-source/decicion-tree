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
