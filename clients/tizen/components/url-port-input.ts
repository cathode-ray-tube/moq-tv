const TAG = "url-port-input";

class UrlPortInput extends HTMLElement {
  private url = "";
  private port = "";

  connectedCallback() {
    this.innerHTML = `
      <div class="uip">
        <div class="uip-title">STREAM SOURCE</div>
        <div class="uip-row">
          <input class="uip-url" type="text" inputmode="url" placeholder="https://example.com/manifest.m3u8" />
        </div>
        <div class="uip-row">
          <input class="uip-port" type="text" inputmode="numeric" placeholder="Port (optional)" />
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .uip{
        width: min(520px, 100%);
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        padding: 12px 14px;
        box-shadow: 0 0 0 1px rgba(255,255,255,.05);
        margin-bottom: 14px;
      }
      .uip-title{
        font-size: 11px;
        color: rgba(143,179,255,.95);
        letter-spacing: .5px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .uip-row{
        margin: 8px 0;
      }
      input{
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.12);
        color: rgba(219,232,255,.95);
        font-size: 13px;
      }
      input:focus-visible{
        outline: 2px solid rgba(79,181,255,.6);
        outline-offset: 2px;
      }
    `;
    this.appendChild(style);

    const urlInput = this.querySelector<HTMLInputElement>(".uip-url")!;
    const portInput = this.querySelector<HTMLInputElement>(".uip-port")!;
    urlInput.addEventListener("input", () => (this.url = urlInput.value));
    portInput.addEventListener("input", () => (this.port = portInput.value));

    // Let dev press Enter to emit a “source updated”
    const onCommit = () => {
      this.dispatchEvent(
        new CustomEvent("source:update", {
          detail: { url: this.url, port: this.port },
          bubbles: true
        })
      );
    };

    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onCommit();
    });
    portInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onCommit();
    });
  }
}

customElements.define(TAG, UrlPortInput);
export { UrlPortInput };
