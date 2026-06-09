/* Navigation component: remote handling and focus management with ARIA + Tizen keys */
type FocusableItem = { el: HTMLElement; row?: number; col?: number };

export class MoqNavigation extends HTMLElement {
  private items: FocusableItem[] = [];
  private currentIndex = 0;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<style>:host{display:none}</style><slot></slot>`;
    this.handleKey = this.handleKey.bind(this);
  }

  connectedCallback() {
    window.addEventListener('keydown', this.handleKey);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKey);
  }

  registerFocusable(el: HTMLElement) {
    if (!this.items.find(i => i.el === el)) {
      this.items.push({ el });
      el.tabIndex = -1;
      el.setAttribute('role', el.getAttribute('role') || 'button');
      el.setAttribute('aria-hidden', 'false');
    }
  }

  focusItem(index: number) {
    if (index < 0 || index >= this.items.length) return;
    const prev = this.items[this.currentIndex];
    if (prev) {
      prev.el.removeAttribute('aria-current');
      prev.el.removeAttribute('focused');
    }
    this.currentIndex = index;
    const cur = this.items[this.currentIndex];
    cur.el.setAttribute('focused', '');
    cur.el.setAttribute('aria-current', 'true');
    try { cur.el.focus(); } catch {}
    this.dispatchEvent(new CustomEvent('moqtv:focus-change', { detail: { index } }));
  }

  private handleKey(e: KeyboardEvent) {
    const key = e.key || '';
    const code = (e as any).keyCode || 0;
    const BACK_KEYS = new Set(['Backspace','SoftLeft','Escape']);
    const isBack = BACK_KEYS.has(key) || code === 10009;

    if (this.items.length === 0) {
      if (isBack) this.dispatchEvent(new Event('moqtv:back'));
      return;
    }

    if (key === 'ArrowRight' || code === 39) {
      this.move(1);
      e.preventDefault();
    } else if (key === 'ArrowLeft' || code === 37) {
      this.move(-1);
      e.preventDefault();
    } else if (key === 'ArrowDown' || code === 40) {
      this.moveRow(1);
      e.preventDefault();
    } else if (key === 'ArrowUp' || code === 38) {
      this.moveRow(-1);
      e.preventDefault();
    } else if (key === 'Enter' || code === 13 || code === 417) {
      const cur = this.items[this.currentIndex];
      cur.el.dispatchEvent(new Event('click'));
      e.preventDefault();
    } else if (isBack) {
      this.dispatchEvent(new Event('moqtv:back'));
      e.preventDefault();
    }
  }

  private move(delta: number) {
    const next = Math.min(this.items.length - 1, Math.max(0, this.currentIndex + delta));
    this.focusItem(next);
  }

  private moveRow(deltaRow: number) {
    const current = this.items[this.currentIndex];
    const box = current.el.getBoundingClientRect();
    const yTarget = box.top + deltaRow * box.height;
    let bestIndex = this.currentIndex;
    let bestDist = Infinity;
    for (let i = 0; i < this.items.length; i++) {
      const b = this.items[i].el.getBoundingClientRect();
      const dy = Math.abs(b.top - yTarget);
      const dx = Math.abs(b.left - box.left);
      const dist = dy * 4 + dx;
      if (dist < bestDist) { bestDist = dist; bestIndex = i; }
    }
    this.focusItem(bestIndex);
  }
}

customElements.define('moq-navigation', MoqNavigation);
