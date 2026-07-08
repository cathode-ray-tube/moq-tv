const TAG = "sidebar-menu";

type MenuItem = { label: string; icon?: string };

class SidebarMenu extends HTMLElement {
  private items: MenuItem[] = [
    { label: "Live", icon: "⬚" },
    { label: "Sport", icon: "⚽" },
    { label: "Discussion", icon: "💬" },
    { label: "Music", icon: "♫" },
    { label: "News", icon: "📰" },
    { label: "Search", icon: "🔍" }
  ];

  private selected = 0;

  constructor() {
    super();
    this.style.display = "block";
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = `
      <div class="sb">
        <div class="sb-title">
          <div class="logo-dot"></div>
          <div class="sb-title-text">SMART TV</div>
          <div class="sb-subtitle">GRID SYSTEM</div>
        </div>

        <div class="sb-items">
          ${this.items
            .map(
              (it, i) => `
            <div class="sb-item" tabindex="-1"
                 data-focusable="true"
                 data-sb-index="${i}"
                 role="button"
                 aria-label="${it.label}">
              <div class="sb-icon">${it.icon ?? ""}</div>
              <div class="sb-label">${it.label}</div>
              <div class="sb-glow"></div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .sb{
        height:100%;
        background: rgba(3,9,22,.35);
        border-right: 1px solid rgba(255,255,255,.08);
        padding: 10px 8px;
        box-sizing:border-box;
      }
      .sb-title{
        padding: 10px 10px 14px 10px;
        position:relative;
      }
      .sb-title-text{
        font-weight: 800;
        letter-spacing: .6px;
        font-size: 14px;
      }
      .sb-subtitle{
        margin-top: 2px;
        font-size: 11px;
        color: rgba(143,179,255,.9);
        letter-spacing: .3px;
      }
      .logo-dot{
        width: 10px; height: 10px;
        border-radius: 999px;
        background: #56d3ff;
        position:absolute;
        left: 10px; top: 14px;
        box-shadow: 0 0 0 5px rgba(86,211,255,.12);
      }

      .sb-items{
        margin-top: 6px;
        display:flex;
        flex-direction:column;
        gap: 10px;
      }
      .sb-item{
        position:relative;
        padding: 10px 12px;
        display:flex;
        align-items:center;
        gap: 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.04);
        box-sizing:border-box;
        user-select:none;
      }
      .sb-item:focus-visible{
        border-color: rgba(79,181,255,.65);
        box-shadow: 0 0 0 3px rgba(79,181,255,.25);
      }
      .sb-icon{
        width: 26px;
        height: 26px;
        border-radius: 8px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: rgba(79,181,255,.12);
        border: 1px solid rgba(79,181,255,.22);
        font-size: 14px;
      }
      .sb-label{
        font-size: 13px;
        color: rgba(219,232,255,.95);
      }
      .sb-glow{
        position:absolute;
        right: 10px;
        width: 8px; height: 8px;
        border-radius: 999px;
        background: rgba(79,181,255,.0);
      }
      .sb-item[data-sb-index="0"]{
        background: rgba(79,181,255,.08);
      }
    `;
    this.appendChild(style);

    const nodes = Array.from(this.querySelectorAll<HTMLElement>(".sb-item[data-focusable='true']"));
    nodes.forEach((node, i) => {
      node.tabIndex = -1;
      node.focused = false;
      node.addEventListener("focus", () => (this.selected = i));
      (node as any).activate = () => this.onActivate(i);
    });

    this.updateSelection();
  }

  private updateSelection() {
    const nodes = Array.from(this.querySelectorAll<HTMLElement>(".sb-item"));
    nodes.forEach((n) => n.classList.remove("active"));
    nodes[this.selected]?.classList.add("active");
  }

  private onActivate(i: number) {
    this.selected = i;
    this.updateSelection();

    // Provide a simple event so video-grid can react (dev can implement category filtering)
    this.dispatchEvent(
      new CustomEvent("sidebar:select", {
        detail: { index: i, label: this.items[i]?.label ?? "" },
        bubbles: true
      })
    );
  }
}

customElements.define(TAG, SidebarMenu);
export { SidebarMenu };
