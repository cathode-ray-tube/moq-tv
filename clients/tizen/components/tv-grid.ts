const TAG = "tv-grid";

import type { VideoTileData } from "./video-tile.js";

class tvGrid extends HTMLElement {
  private tiles: VideoTileData[] = [
    { id: "1", title: "GLOBAL NEWS", subtitle: "24/7 Breaking News", badge: "LIVE", thumbColor: "#0e3b8e", src: "https://example.com/video1.mp4" },
    { id: "2", title: "Premier League Live", subtitle: "FIFA ???", badge: "LIVE", thumbColor: "#0a2f6b", src: "https://example.com/video2.mp4" },
    { id: "3", title: "24H Le Mans", subtitle: "Live Qualifying", badge: "LIVE", thumbColor: "#103a5a", src: "https://example.com/video3.mp4" },
    { id: "4", title: "Top Hits Live", subtitle: "Music Stream", badge: "LIVE", thumbColor: "#2a1c6a", src: "https://example.com/video4.mp4" }
  ];

  connectedCallback() {
    this.render();
    this.bindEvents();
    this.layoutTilesWithTvGrid();
  }

  private render() {
    this.innerHTML = `
      <div class="vg">
        <div class="vg-panel">
          <div class="vg-title">VIDEOS</div>
          <div class="vg-sub">Curated Live Channels</div>
          <div class="vg-grid" aria-label="Video tiles"></div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .vg{
        width:100%;
        height:100%;
      }
      .vg-panel{
        width:100%;
        height:100%;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.12);
        background: linear-gradient(180deg, rgba(12,34,74,.40), rgba(5,11,24,.22));
        box-shadow: 0 0 0 1px rgba(255,255,255,.05), 0 30px 70px rgba(0,0,0,.45);
        padding: 14px 16px;
        box-sizing:border-box;
        position:relative;
        overflow:hidden;
      }
      .vg-panel:before{
        content:"";
        position:absolute; inset:-2px;
        background: radial-gradient(900px 500px at 70% 20%, rgba(79,181,255,.18), transparent 60%);
        pointer-events:none;
      }
      .vg-title{
        position:relative;
        font-weight: 900;
        letter-spacing: .5px;
        font-size: 14px;
        color: rgba(219,232,255,.98);
      }
      .vg-sub{
        position:relative;
        margin-top: 4px;
        font-size: 12px;
        color: rgba(143,179,255,.92);
      }
      .vg-grid{
        position:relative;
        margin-top: 14px;
        width:100%;
        height: calc(100% - 44px);
      }
    `;
    this.appendChild(style);
  }

  private bindEvents() {
    this.addEventListener("tile:select", (e: Event) => {
      const ce = e as CustomEvent<VideoTileData>;
      const req = ce.detail;
      const overlay = document.querySelector("player-overlay") as any;
      overlay?.play?.({ src: this.resolveSrc(req.src), title: req.title, poster: req.poster });
    });

    // React to URL/Port inputs if developer emits updated source details.
    this.addEventListener("source:update", (e: Event) => {
      const det = (e as CustomEvent).detail as { url: string; port: string };
      // Example: dev can map their URL+port into tile srcs.
      // Here we simply broadcast to tiles that have src and want replacement.
      this.tiles = this.tiles.map((t, i) => ({
        ...t,
        src: det.url ? this.joinUrlPort(det.url, det.port) : t.src
      }));
      this.rebuildTiles();
    });

    // Sidebar selection can filter or re-map tiles
    document.addEventListener("sidebar:select", (e: Event) => {
      const det = (e as CustomEvent).detail as { index: number; label: string };
      // Basic example: just change badges/colors
      const base = det.index * 37;
      this.tiles = this.tiles.map((t, i) => ({
        ...t,
        badge: "LIVE",
        thumbColor: i % 2 === 0 ? `hsl(${(base + i * 18) % 360} 60% 35%)` : `hsl(${(base + i * 22 + 120) % 360} 55% 28%)`
      }));
      this.rebuildTiles();
    });
  }

  private rebuildTiles() {
    const host = this.querySelector(".vg-grid") as HTMLElement;
    host.innerHTML = "";
    this.tiles.forEach((t) => {
      const tile = document.createElement("video-tile") as any;
      tile.setAttribute("data-id", t.id);
      tile.setAttribute("data-title", t.title);
      tile.setAttribute("data-subtitle", t.subtitle ?? "");
      tile.setAttribute("data-badge", t.badge ?? "");
      tile.setAttribute("data-src", t.src ?? "");
      if (t.poster) tile.setAttribute("data-poster", t.poster);
      tile.setAttribute("data-color", t.thumbColor ?? "#1a3d8f");
      host.appendChild(tile);
    });

    this.layoutTilesWithTvGrid();
  }

  private layoutTilesWithTvGrid() {
    const tvGrid = document.getElementById("rootGrid") as any;
    const host = this.querySelector(".vg-grid") as HTMLElement;
    if (!tvGrid || !host) return;

    // Clear any old placements by hiding/reflowing
    // We rely on tv-grid include() for absolute placement.
    // Strategy:
    // - Place first N tiles into a grid-like arrangement inside tv-grid coordinates.
    // - Developers can change cell maps later.
    const tiles = Array.from(host.querySelectorAll<HTMLElement>("video-tile"));

    // Example cell map for 6 rows x 8 cols.
    // You can tune these to match your screenshot’s exact tile positions.
    const cellMap = [
      { row: 0, col: 1, rowSpan: 1, colSpan: 2 },
      { row: 0, col: 3, rowSpan: 1, colSpan: 2 },
      { row: 0, col: 5, rowSpan: 1, colSpan: 2 },
      { row: 1, col: 1, rowSpan: 1, colSpan: 2 }
    ];

    tiles.forEach((tile, i) => {
      const cell = cellMap[i % cellMap.length];
      // Ensure tile is attached to tv-grid placement root
      tvGrid.grid.include(tile, cell);
    });

    // Ensure tiles are focusable for navigation:
    tiles.forEach((tile) => {
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("data-focusable", "true");
    });
  }

  private resolveSrc(src?: string) {
    return src ?? "";
  }

  private joinUrlPort(url: string, port: string) {
    // Simple example joiner: if url already has protocol/host, you can parse properly.
    // For now we preserve and append ?port=... or replace host if user provides host-only.
    const p = port?.trim();
    if (!p) return url;
    const hasQuery = url.includes("?");
    return `${url}${hasQuery ? "&" : "?"}port=${encodeURIComponent(p)}`;
  }
}

customElements.define(TAG, VideoGrid);
export { VideoGrid };
