# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file personal portfolio (`index.html`) styled as a macOS-like desktop OS UI. No build system, no dependencies, no package manager — open directly in a browser.

## Architecture

The entire app lives in `index.html` with three sections:

1. **CSS** (lines 7–157) — All styles inline in `<style>`. Uses CSS custom properties (`--bg`, `--accent`, `--text`, etc.) for theming. Class names are short/minified (`.win`, `.wtb`, `.wb`, `.di`, etc.).

2. **HTML** (lines 159–393) — Static markup for:
   - `#mb` — Fixed top menu bar
   - `#desk` — Desktop area containing draggable windows (`#win-about`, `#win-blog`, `#win-contact`, `#win-projects`, `#win-experience`, `#win-terminal`, `#win-settings`)
   - `#dock` — Fixed bottom dock
   - `#srch` — Search overlay (`Cmd/Ctrl+K`)
   - `#ctx` — Right-click context menu
   - `<canvas id="dog">` — Pixel-art dog, drawn procedurally

3. **JavaScript** (lines 394–663) — Vanilla JS, no framework:
   - Window management: `ow(id)` open, `cw(id)` close, `mw(id)` minimise, `xw(id)` maximise/restore, `ca()` close all
   - Dragging: titlebar (`#tb-<id>`) mousedown/mousemove/mouseup on `document`
   - Z-index stacking via global `Z` counter
   - Search: `sitems` array, `os()`/`hs()`/`us(q)` open/hide/update
   - Terminal: `tcmds` object maps command strings to handler functions; `tkey(e)` on Enter key
   - Theming: `wps` array of `{n, bg, ac}` objects; `applyWp(wp, idx)` updates CSS vars
   - Pixel dog: IIFE using `<canvas>` with 9px grid

## Key Patterns

- Windows are identified by short string IDs (`'about'`, `'blog'`, etc.) matching `#win-<id>` and `#tb-<id>` elements.
- `defpos` object holds default `{x, y}` positions for each window on first open.
- Windows cascade by `open.size * 18` offset when multiple are open.
- Theming works entirely via `document.documentElement.style.setProperty('--bg', ...)` — no class swaps needed.
- To add a new window: add a `<div class="win" id="win-<id>">` in HTML, add `<id>` to the `wins` array, add a `defpos` entry, and wire up open buttons.
- To add a terminal command: add a key to `tcmds` with a handler function returning the output string (or `null` for no output).
