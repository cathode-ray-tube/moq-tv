const TAG = "samsung-navigation";

type Focusable = HTMLElement & { activate?: () => void };

class SamsungNavigation extends HTMLElement {
  private root?: HTMLElement;
  private focusables: Focusable[] = [];
  private idx = 0;

  constructor() {
    super();
    this.style.display = "none";
  }

  connectedCallback() {
    // discover focusables
    this.refresh();
    window.addEventListener("keydown", this.onKeyDown);
    // initial focus
    requestAnimationFrame(() => this.focusCurrent());
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private refresh() {
    const all = Array.from(document.querySelectorAll<Focusable>("[data-focusable='true']"));
    this.focusables = all;
    this.idx = Math.min(this.idx, Math.max(0, this.focusables.length - 1));
  }

  private focusCurrent() {
    if (this.focusables.length === 0) return;
    this.focusables[this.idx]?.focus?.();
  }

  private move(delta: number) {
    if (this.focusables.length === 0) return;
    this.idx = (this.idx + delta + this.focusables.length) % this.focusables.length;
    this.focusCurrent();
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const key = e.key;

    // TV remote keys often map to arrows, Enter, Back/Return
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      this.move(1);
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      this.move(-1);
    } else if (key === "Enter" || key === "OK" || key === "Return") {
      e.preventDefault();
      const el = this.focusables[this.idx];
      el?.activate?.();
    } else if (key === "Escape" || key === "Backspace") {
      // Optional: allow back to close overlays if any exist
      const overlay = document.querySelector("player-overlay") as any;
      overlay?.close?.();
    } else {
      // Optional: refresh on-demand if dynamic tiles change
      // (cheap and avoids missing newly added elements)
      if (this.focusables.length === 0) this.refresh();
    }
  };
}

customElements.define(TAG, SamsungNavigation);
export { SamsungNavigation };
