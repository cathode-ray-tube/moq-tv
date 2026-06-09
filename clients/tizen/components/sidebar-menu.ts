/* Sidebar with logo and categories */
export class SidebarMenu extends HTMLElement {
  items: { id: string; label: string; icon?: string }[] = [];
  onSelect: ((id: string) => void) | null = null;

  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.innerHTML = `
      <style>
        :host{display:block;width:220px;background:linear-gradient(180deg,#001a24,#00111a);color:#cfeffd;font-family:inherit;padding:18px 12px;box-sizing:border-box;border-radius:12px}
        .logo{display:flex;align-items:center;gap:10px;margin-bottom:18px}
        .logo img{width:56px;height:56px;border-radius:8px}
        .menu{display:flex;flex-direction:column;gap:8px}
        .item{padding:10px;border-radius:8px;display:flex;align-items:center;gap:10px;cursor:pointer;background:transparent}
        .item:hover, .item[focused]{background:rgba(6,182,212,0.06);outline: none}
        .icon{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center}
      </style>
      <div class="logo">
        <img id="logo" alt="moqtv logo"/>
        <div style="font-weight:700;font-size:18px">moqtv</div>
      </div>
      <nav class="menu" id="menu" role="menu" aria-label="Categories"></nav>
    `;
  }

  connectedCallback() {
    const logo = this.shadowRoot!.getElementById('logo') as HTMLImageElement;
    (logo as HTMLImageElement).src = this.getAttribute('logo-src') || '';
    this.render();
  }

  set itemsList(list: { id: string; label: string; icon?: string }[]) {
    this.items = list || [];
    this.render();
  }

  private render() {
    const menu = this.shadowRoot!.getElementById('menu')!;
    menu.innerHTML = '';
    for (const it of this.items) {
      const el = document.createElement('div');
      el.className = 'item';
      el.tabIndex = 0;
      el.setAttribute('role', 'menuitem');
      el.innerHTML = `<div class="icon" aria-hidden="true">${it.icon ? `<img src="${it.icon}" style="width:20px;height:20px"/>` : ''}</div><div class="label">${it.label}</div>`;
      el.addEventListener('click', () => {
        if (this.onSelect) this.onSelect(it.id);
        this.dispatchEvent(new CustomEvent('moqtv:menu-select', { detail: it.id }));
      });
      menu.appendChild(el);
    }
  }
}

customElements.define('moq-sidebar', SidebarMenu);
