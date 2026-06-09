import './video-tile.js';
import type { VideoTileData } from './video-tile.js';

/* Grid of video tiles */
export class VideoGrid extends HTMLElement {
  tiles: VideoTileData[] = [];
  onTileClick: ((data: VideoTileData) => void) | null = null;

  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        :host{display:block}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
        .title{color:#bfe9f3;font-weight:700;margin-bottom:8px}
      </style>
      <div>
        <div class="title" id="grid-title"></div>
        <div class="grid" id="grid" role="list"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.render();
  }

  set items(list: VideoTileData[]) {
    this.tiles = list || [];
    this.render();
  }

  set title(text: string) {
    const t = this.shadowRoot!.getElementById('grid-title')!;
    t.textContent = text;
  }

  private render() {
    const grid = this.shadowRoot!.getElementById('grid')!;
    grid.innerHTML = '';
    for (const t of this.tiles) {
      const el = document.createElement('moq-video-tile') as any;
      el.dataValue = t;
      el.tabIndex = 0;
      el.onClick = (d: VideoTileData) => {
        if (this.onTileClick) this.onTileClick(d);
        this.dispatchEvent(new CustomEvent('moqtv:tileclick', { detail: d }));
      };
      grid.appendChild(el);
    }
  }
}

customElements.define('moq-video-grid', VideoGrid);
