/* Icon/account/settings area */
export class IconBar extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        :host{display:flex;gap:14px;align-items:center}
        .icon{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;color:#bfe9f3;cursor:pointer}
      </style>
      <div class="icon" id="account" tabindex="0" title="Account" role="button" aria-label="Account">👤</div>
      <div class="icon" id="settings" tabindex="0" title="Settings" role="button" aria-label="Settings">⚙️</div>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.getElementById('account')!.addEventListener('click', () => this.dispatchEvent(new CustomEvent('moqtv:account')));
    this.shadowRoot!.getElementById('settings')!.addEventListener('click', () => this.dispatchEvent(new CustomEvent('moqtv:settings')));
  }
}

customElements.define('moq-icon-bar', IconBar);
