const TAG = "player-overlay";

type PlayRequest = {
  src: string;
  title?: string;
  poster?: string;
};

class PlayerOverlay extends HTMLElement {
  private video?: HTMLVideoElement;
  private container?: HTMLElement;
  private current?: PlayRequest;

  constructor() {
    super();
    this.style.display = "block";
    this.style.opacity = "0";
    this.style.pointerEvents = "none";
    this.style.transition = "opacity 160ms ease";
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="overlay-bg" part="bg">
        <div class="overlay-panel" part="panel">
          <div class="overlay-header">
            <div class="overlay-title" part="title"></div>
            <button class="overlay-close" part="close" type="button">✕</button>
          </div>
          <video class="overlay-video" part="video" controls playsinline></video>
        </div>
      </div>
    `;

    this.container = this;
    const bg = this.querySelector(".overlay-bg") as HTMLElement;
    const panel = this.querySelector(".overlay-panel") as HTMLElement;

    // Basic overlay styling (tuned to screenshot aesthetic)
    panel.style.background = "linear-gradient(180deg, rgba(12,34,74,.92), rgba(5,11,24,.92))";
    panel.style.border = "1px solid rgba(255,255,255,.14)";
    panel.style.borderRadius = "18px";
    panel.style.boxShadow = "0 0 0 1px rgba(255,255,255,.06), 0 26px 60px rgba(0,0,0,.6)";

    const titleEl = this.querySelector(".overlay-title") as HTMLElement;
    const closeBtn = this.querySelector(".overlay-close") as HTMLButtonElement;

    this.video = this.querySelector("video") as HTMLVideoElement;

    closeBtn.addEventListener("click", () => this.close());
    bg.addEventListener("click", (ev) => {
      if (ev.target === bg) this.close();
    });

    // Expose for other components
    (this as any).playRequest = (req: PlayRequest) => this.play(req);
    if (titleEl) titleEl.textContent = "";
  }

  play(req: PlayRequest) {
    this.current = req;
    this.style.opacity = "1";
    this.style.pointerEvents = "auto";

    const titleEl = this.querySelector(".overlay-title") as HTMLElement;
    if (titleEl) titleEl.textContent = req.title ?? "";

    if (!this.video) return;
    if (req.poster) this.video.poster = req.poster;
    this.video.src = req.src;

    this.video
      .play()
      .catch(() => {
        // some devices require user gesture; dev can handle if needed
      });

    // Focus close button for remote navigation
    closeBtnFocusSoon(this);
  }

  close() {
    this.style.opacity = "0";
    this.style.pointerEvents = "none";
    if (this.video) {
      this.video.pause();
      this.video.removeAttribute("src");
      this.video.load();
    }
    this.current = undefined;
  }
}

function closeBtnFocusSoon(el: HTMLElement) {
  requestAnimationFrame(() => {
    const btn = el.querySelector(".overlay-close") as HTMLElement | null;
    btn?.focus?.();
  });
}

customElements.define(TAG, PlayerOverlay);
export { PlayerOverlay };
