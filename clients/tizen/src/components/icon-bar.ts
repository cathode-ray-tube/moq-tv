const TAG = "icon-bar";

class IconBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="bar">
        <div class="bar-left">
          <div class="pill">LIVE</div>
          <div class="time">21:00</div>
        </div>
        <div class="bar-mid">
          <div class="search-pill">🔎</div>
        </div>
        <div class="bar-right">
          <div class="stat">4443</div>
          <div class="stat-icon">👤</div>
          <div class="stat-icon">⚙</div>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .bar{
        width: 100%;
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.04);
        box-shadow: 0 0 0 1px rgba(255,255,255,.04);
      }
      .bar-left{
        display:flex;
        gap: 12px;
        align-items:center;
      }
      .pill{
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(79,181,255,.35);
        background: rgba(79,181,255,.10);
        color: rgba(219,232,255,.95);
        font-weight: 800;
        font-size: 12px;
      }
      .time{
        font-size: 18px;
        font-weight: 900;
        color: rgba(219,232,255,.98);
      }
      .bar-mid{ display:flex; gap:10px; }
      .search-pill{
        width: 34px; height: 34px;
        border-radius: 12px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.12);
      }
      .bar-right{
        display:flex;
        gap: 14px;
        align-items:center;
      }
      .stat{
        font-weight: 800;
        color: rgba(143,179,255,.95);
      }
      .stat-icon{
        width: 34px; height: 34px;
        border-radius: 12px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.12);
      }
    `;
    this.appendChild(style);
  }
}

customElements.define(TAG, IconBar);
export { IconBar };
