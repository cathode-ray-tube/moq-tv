/* Player overlay/modal component.
   Exposes methods:
     - open({title, src, metadata})
     - close()
   Emits events: moqtv:opened, moqtv:closed, moqtv:play, moqtv:pause, moqtv:stop
   Note: Demo uses native <video>. Replace with moq QUIC integration.
*/
export interface PlayerOptions {
  id?: string;
  title?: string;
  src?: string; // for demo only
  metadata?: any;
}

export class PlayerOverlay extends HTMLElement {
  private container!: HTMLElement;
  private videoEl!: HTMLVideoElement;
  private titleEl!: HTMLElement;
  private visible = false;

  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        :host{position:fixed;inset:0;display:none;align-items:center;justify-content:center;font-family:inherit;z-index:9999}
        .backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)}
        .panel{position:relative;background:linear-gradient(180deg,#001826,#001018);width:84vw;height:72vh;border-radius:12px;padding:14px;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;box-shadow:0 20px 60px rgba(0,0,0,0.6)}
        .header{display:flex;justify-content:space-between;align-items:center;color:var(--text)}
        .title{font-weight:700;font-size:18px}
        .controls{display:flex;gap:8px;align-items:center}
        .btn{background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:8px;color:var(--text);cursor:pointer}
        .player{flex:1;background:#000;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center}
        video{width:100%;height:100%;object-fit:cover;background:#000}
      </style>
      <div class="backdrop" id="backdrop" role="presentation"></div>
      <div class="panel" role="dialog" aria-modal="true" aria-label="Player dialog">
        <div class="header">
          <div class="title" id="title">Player</div>
          <div class="controls">
            <div class="btn" id="play" role="button" tabindex="0" aria-label="Play">▶️</div>
            <div class="btn" id="pause" role="button" tabindex="0" aria-label="Pause">⏸️</div>
            <div class="btn" id="stop" role="button" tabindex="0" aria-label="Stop">⏹️</div>
            <div class="btn" id="close" role="button" tabindex="0" aria-label="Close">✖</div>
          </div>
        </div>
        <div class="player" id="player">
          <video id="video" controls></video>
        </div>
      </div>
    `;

    this.handleKey = this.handleKey.bind(this);
  }

  connectedCallback() {
    this.container = this.shadowRoot!.host as unknown as HTMLElement;
    this.videoEl = this.shadowRoot!.getElementById('video') as HTMLVideoElement;
    this.titleEl = this.shadowRoot!.getElementById('title') as HTMLElement;

    this.shadowRoot!.getElementById('play')!.addEventListener('click', () => { this.play(); });
    this.shadowRoot!.getElementById('pause')!.addEventListener('click', () => { this.pause(); });
    this.shadowRoot!.getElementById('stop')!.addEventListener('click', () => { this.stop(); });
    this.shadowRoot!.getElementById('close')!.addEventListener('click', () => { this.close(); });
    this.shadowRoot!.getElementById('backdrop')!.addEventListener('click', () => this.close());

    window.addEventListener('keydown', this.handleKey);
    this.videoEl.addEventListener('play', () => this.dispatchEvent(new Event('moqtv:play')));
    this.videoEl.addEventListener('pause', () => this.dispatchEvent(new Event('moqtv:pause')));
    this.videoEl.addEventListener('ended', () => this.dispatchEvent(new Event('moqtv:stop')));
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKey);
  }

  async open(opts: PlayerOptions) {
    this.visible = true;
    (this.shadowRoot!.host as HTMLElement).style.display = 'flex';
    this.titleEl.textContent = opts.title || 'Live';
    if (opts.src) {
      this.videoEl.src = opts.src;
      try { await this.videoEl.play(); } catch {}
    }
    this.dispatchEvent(new CustomEvent('moqtv:opened', { detail: opts }));
    const playBtn = this.shadowRoot!.getElementById('play') as HTMLElement;
    try { playBtn.focus(); } catch {}
  }

  close() {
    this.visible = false;
    try { this.videoEl.pause(); } catch {}
    this.videoEl.src = '';
    (this.shadowRoot!.host as HTMLElement).style.display = 'none';
    this.dispatchEvent(new Event('moqtv:closed'));
  }

  play() { this.videoEl.play(); }
  pause() { this.videoEl.pause(); }
  stop() { this.videoEl.pause(); this.videoEl.currentTime = 0; }

  private handleKey(e: KeyboardEvent) {
    const key = e.key || '';
    const code = (e as any).keyCode || 0;
    if (!this.visible) return;
    if (key === 'Enter' || code === 13) {
      if (this.videoEl.paused) this.play(); else this.pause();
      e.preventDefault();
    } else if ((key === 'Backspace' || key === 'SoftLeft' || code === 10009 || key === 'Escape')) {
      this.close();
      e.preventDefault();
    } else if (key === 'ArrowLeft') {
      this.videoEl.currentTime = Math.max(0, this.videoEl.currentTime - 5);
      e.preventDefault();
    } else if (key === 'ArrowRight') {
      this.videoEl.currentTime = Math.min(this.videoEl.duration || Infinity, this.videoEl.currentTime + 5);
      e.preventDefault();
    }
  }
}

customElements.define('moq-player-overlay', PlayerOverlay);
