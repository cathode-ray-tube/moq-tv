/* URL + Port input custom element */
export class UrlPortInput extends HTMLElement {
  private urlInput!: HTMLInputElement;
  private portInput!: HTMLInputElement;
  private connectButton!: HTMLButtonElement;
  onConnect: ((url: string, port: number) => void) | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host{display:block;font-family:inherit}
        .wrap{display:flex;gap:10px;align-items:center}
        input{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);color:#cfeffd;padding:8px 10px;border-radius:8px;min-width:220px}
        .port{width:90px}
        button{background:linear-gradient(180deg,#06b6d4,#0284b5);border:none;color:white;padding:8px 14px;border-radius:8px;cursor:pointer}
      </style>
      <div class="wrap" role="group" aria-label="Connection settings">
        <input part="url" placeholder="URL (https://...)" id="url" aria-label="Stream URL"/>
        <input part="port" placeholder="Port" id="port" class="port" aria-label="Port"/>
        <button id="connect" aria-label="Connect">Connect</button>
      </div>
    `;
    this.urlInput = shadow.getElementById('url') as HTMLInputElement;
    this.portInput = shadow.getElementById('port') as HTMLInputElement;
    this.connectButton = shadow.getElementById('connect') as HTMLButtonElement;
  }

  connectedCallback() {
    this.connectButton.addEventListener('click', this.handleConnect);
    this.portInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleConnect();
    });
    this.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleConnect();
    });
  }

  disconnectedCallback() {
    this.connectButton.removeEventListener('click', this.handleConnect);
  }

  private handleConnect = () => {
    const url = this.urlInput.value.trim();
    const port = parseInt(this.portInput.value.trim() || '0', 10) || 0;
    if (this.onConnect) this.onConnect(url, port);
    this.dispatchEvent(new CustomEvent('moqtv:connect', { detail: { url, port } }));
  };
}

customElements.define('moq-url-port', UrlPortInput);
