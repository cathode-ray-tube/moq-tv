const TAG = "video-tile";

export type VideoTileData = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  thumbColor?: string;
  src?: string; // media src
  poster?: string;
};

class VideoTile extends HTMLElement {
  static get observedAttributes() {
    return ["data-id", "data-title", "data-subtitle", "data-badge", "data-src", "data-poster", "data-color"];
  }

  private data: VideoTileData | null = null;

  constructor() {
    super();
    this.tabIndex = 0;
    this.setAttribute("data-focusable", "true");
  }

  connectedCallback() {
    this.render();
    (this as any).activate = () => this.activate();
  }

  attributeChangedCallback() {
    this.readFromAttributes();
    this.render();
  }

  private readFromAttributes() {
    const id = this.getAttribute("data-id") ?? "";
    const title = this.getAttribute("data-title") ?? "";
    const subtitle = this.getAttribute("data-subtitle") ?? "";
    const badge = this.getAttribute("data-badge") ?? "";
    const src = this.getAttribute("data-src") ?? undefined;
    const poster = this.getAttribute("data-poster") ?? undefined;
    const thumbColor = this.getAttribute("data-color") ?? "#1a3d8f";

    this.data = { id, title, subtitle, badge, src, poster, thumbColor };
  }

  private render() {
    this.readFromAttributes();
    const d = this.data;
    if (!d) return;

    // A stylized tile approximating your screenshot’s “live card” look.
    // Pixel-perfect matching: tweak CSS variables in this component.
    const badgeText = d.badge ? d.badge : "LIVE";

    this.innerHTML = `
      <div class="tile" part="tile" style="--thumb:${d.thumbColor ?? "#1a3d8f"};">
        <div class="tile-media"></div>
        <div class="tile-badge">${badgeText}</div>

        <div class="tile-text">
          <div class="tile-title">${escapeHtml(d.title)}</div>
          ${d.subtitle ? `<div class="tile-sub">${escapeHtml(d.subtitle)}</div>` : ``}
        </div>

        <div class="tile-border"></div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .tile{
        width:100%; height:100%;
        position:relative;
        border-radius: 12px;
        overflow:hidden;
        background: rgba(255,255,255,.03);
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 0 0 1px rgba(255,255,255,.05);
        transform: translateZ(0);
      }

      .tile-media{
        position:absolute; inset:0;
        background:
          radial-gradient(600px 220px at 20% 20%, rgba(70,180,255,.40), transparent 55%),
          radial-gradient(420px 260px at 80% 80%, rgba(255,70,180,.20), transparent 60%),
          linear-gradient(135deg, rgba(0,0,0,.25), rgba(0,0,0,.65)),
          linear-gradient(180deg, rgba(255,255,255,.06), transparent),
          var(--thumb);
        filter: saturate(1.15) contrast(1.05);
      }

      .tile-badge{
        position:absolute;
        top: 8px;
        left: 10px;
        padding: 6px 10px;
        border-radius: 999px;
        font-weight: 900;
        font-size: 11px;
        letter-spacing: .3px;
        color: rgba(255,255,255,.95);
        background: rgba(255,0,80,.18);
        border: 1px solid rgba(255,0,120,.35);
        box-shadow: 0 0 0 3px rgba(255,0,90,.10);
      }

      .tile-text{
        position:absolute;
        left: 12px;
        right: 12px;
        bottom: 10px;
      }
      .tile-title{
        font-weight: 900;
        font-size: 13px;
        line-height: 1.2;
        color: rgba(219,232,255,.98);
        text-shadow: 0 2px 8px rgba(0,0,0,.55);
      }
      .tile-sub{
        margin-top: 4px;
        font-size: 11px;
        color: rgba(143,179,255,.95);
        text-shadow: 0 2px 8px rgba(0,0,0,.55);
      }

      .tile-border{
        position:absolute; inset:0;
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
        pointer-events:none;
      }

      /* Focus ring */
      :host(:focus-visible){
        outline: none;
      }
      :host(:focus-visible) .tile{
        border-color: rgba(79,181,255,.75);
        box-shadow:
          0 0 0 3px rgba(79,181,255,.22),
          0 18px 40px rgba(0,0,0,.55);
      }
    `;
    this.appendChild(style);
  }

  private activate() {
    if (!this.data) return;
    // emit selection so video-grid can open player-overlay
    this.dispatchEvent(
      new CustomEvent("tile:select", {
        detail: this.data,
        bubbles: true
      })
    );
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

customElements.define(TAG, VideoTile);
export { VideoTile };
