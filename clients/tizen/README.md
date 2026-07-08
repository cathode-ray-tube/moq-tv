# Moq-TV Samsung Tizen

A responsive 16:9 (1280×720 design) TV layout using a custom `tv-grid` element, plus tiles, navigation, and a video overlay.

# Quick Start

## 1) Install & run
```bash
npm install
npm run dev
```

## 2) Open

Open the URL printed by the dev server, then use:

Arrow keys to move focus
Enter/OK to activate a focused element

### Core layout

`<tv-grid>`: the lynchpin layout engine (16:9 only). It scales to fit the device and provides a developer API to place elements into “TV blocks”.

## UI components (custom HTML elements)

*`<sidebar-menu>`: left menu; dispatches sidebar:select
*`<icon-bar>`: top bar styling
*`<url-port-input>`: emits source:update
*`<video-grid>`: renders <video-tile> items into tv-grid
*`<player-overlay>`: plays the selected tile’s video
*`<video-tile>`: emits tile:select on activate
*`<samsung-navigation>`: remote/keyboard-style focus navigation

### Wiring (how it works)

In index.html, the key elements are:

`<tv-grid id="rootGrid" ...></tv-grid>`
`<video-grid></video-grid>` (it looks up #rootGrid and places tiles via `tvGrid.grid.include()`)

### Dev API: tv-grid placements
```js
const tvGrid = document.getElementById("rootGrid");
```
#### Place an element into a TV block:
```js
vGrid.grid.include(myEl, { row: 0, col: 1, rowSpan: 1, colSpan: 2 });
```
#### Remove:
```js
tvGrid.grid.exclude(myEl);
```
#### Clear all placed elements:
```js
tvGrid.grid.clear();
```
#### Helpers:
```js
tvGrid.grid.getCellRect({ row: 0, col: 0, rowSpan: 1, colSpan: 1 });
```
#### Customize the tile layout

Edit /components/video-grid.ts and update the cellMap used for placing tiles into `tv-grid`.
 
#### Play a video (from a tile selection)
```js
// video-tile emits tile:select, and video-grid calls:

playerOverlay.play({ src, title, poster });
```
