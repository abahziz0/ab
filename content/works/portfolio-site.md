---
title: "This Portfolio Site"
date: "2024-01-10"
tags: ["web", "design", "vanilla-js", "css"]
excerpt: "A single-file portfolio built as a macOS-like desktop OS, entirely in the browser with no dependencies."
type: work
---

## Overview

The portfolio you navigated from to get here is a single HTML file — no framework, no build step, no CDN. Open it directly in a browser and it works.

The UI is modelled on a desktop OS: a menu bar, draggable windows, a dock, a right-click context menu, and a pixel-art dog drawn on a `<canvas>` element.

## Why a single file?

Simplicity of deployment. There is nothing to build, nothing to install, and nothing to break on a server. It's a constraint that forces every feature to earn its place.

## Technical details

| Detail | Value |
|--------|-------|
| Lines of code | ~670 |
| Dependencies | 0 |
| Build step | None |
| Hosting | GitHub Pages |

### CSS

All styles are written inline in a `<style>` block. Theming uses CSS custom properties — switching between light/dark mode or four accent colours happens by updating a handful of variables on `:root`, no class swaps needed.

### JavaScript

Vanilla JS, ~270 lines. Key parts:

- **Window management** — open, close, minimise, maximise, and drag via `mousedown`/`mousemove`/`mouseup` on `document`
- **Z-index stacking** — a single global counter `Z` ensures the focused window always sits on top
- **Terminal emulator** — a `tcmds` object maps command strings to handler functions; type `help` in the terminal to see them
- **Search overlay** — `Cmd/Ctrl+K` opens a spotlight-style search over all sections

### The dog

A 9×9 pixel-art dog drawn procedurally on a `<canvas>` element. Every pixel is a hard-coded coordinate — no image file, no external sprite.

## What I'd change

Given more time I'd add real keyboard navigation for the windows and a proper focus trap for accessibility. The current implementation is mouse-first.
