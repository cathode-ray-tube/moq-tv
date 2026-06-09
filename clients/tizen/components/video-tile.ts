/* Single video tile / thumbnail (ARIA added) */
export interface VideoTileData {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  latencyMs?: number;
  live?: boolean;
}

export class VideoTile extends HTMLElement {
  data: VideoTileData | null = null;
  onClick: ((data: VideoTileData) => void) | null = null;

  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        :host{display:block;box-sizing:border-box;font-family:inherit}
        .card{background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.2));border-radius:12px;padding:10px;color:#e6fbff;position:relative;overflow:hidden;border:1px solid rgba(255,255,255,0.04)}
        .thumb{width:100%;height:120px;background:#071826;border-radius:8px;background-size:cover;background-position:center}
        .meta{padding-top:8px}
        .title{font-weight:700;font-size:14px}
        .desc{font-size:12px;color:#9bdbe7;margin-top:4px;opacity:0.9}
        .badge{position:absolute;left:10px;top:10px;background:#ff385c;color:white;padding:4px 8px;border-radius:8px;font-size:12px}
        .lat{position:absolute;right:10px;top:10px;background:rgba(10,30,40,0.6);color:#bfe9f3;padding:4px 8px;border-radius:8px;font-size:12px}
        :host([focused]) .card {outline:2px solid rgba(6,182,212,0.9);transform:scale(1.02);transition:transform .12s}
      </style>
      <div class="card" id="card" tabindex="-1" role="button" aria-label="">
        <div class="thumb" id="thumb" role="img" aria-label="thumbnail"></div>
        <div class="meta">
          <div class="title" id="title"></div>
          <div class="desc" id="desc"></div>
        </div>
        <div id="liveBadge" class="badge" style="display:none" aria-hidden="true">LIVE</div>
        <div id="lat" class="lat" style="display:none" aria-hidden="true"></div>
      </div>
    `;
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    this.shadowRoot!.getElementById('card')!.addEventListener('click', this.handleClick);
    this.shadowRoot!.getElementById('card')!.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleClick();
    });
  }

  disconnectedCallback() {
    this.shadowRoot!.getElementById('card')!.removeEventListener('click', this.handleClick);
  }

  set dataValue(d: VideoTileData | null) {
    this.data = d;
    this.render();
  }

  private render() {
    if (!this.data) return;
    const s = this.shadowRoot!;
    const thumb = s.getElementById('thumb') as HTMLDivElement;
    thumb.style.backgroundImage = this.data.thumbnail ? `url(${this.data.thumbnail})` : '';
    s.getElementById('title')!.textContent = this.data.title;
    s.getElementById('desc')!.textContent = this.data.description || '';
    const liveBadge = s.getElementById('liveBadge')!;
    const lat = s.getElementById('lat')!;
    if (this.data.live) { liveBadge.style.display = 'block'; } else { liveBadge.style.display = 'none'; }
    if (this.data.latencyMs != null) { lat.style.display = 'block'; lat.textContent = `${this.data.latencyMs} ms`; } else { lat.style.display = 'none'; }
    // ARIA label
    const card = s.getElementById('card')!;
    const aria = `${this.data.title}. ${this.data.description || ''} ${this.data.live ? 'Live.' : ''} ${this.data.latencyMs ? this.data.latencyMs + ' milliseconds latency.' : ''}`;
    card.setAttribute('aria-label', aria);
  }

  private handleClick() {
    if (this.data && this.onClick) this.onClick(this.data);
    this.dispatchEvent(new CustomEvent('moqtv:select', { detail: this.data }));
  }
}

customElements.define('moq-video-tile', VideoTile);
