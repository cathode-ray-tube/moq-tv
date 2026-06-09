/* Main wiring for demo app — updated to use player overlay and ARIA/navigation */
import './components/url-port-input.js';
import './components/sidebar-menu.js';
import './components/video-grid.js';
import './components/video-tile.js';
import './components/icon-bar.js';
import './components/navigation.js';
import './components/player-overlay.js';

const sidebar = document.getElementById('sidebar') as any;
sidebar.itemsList = [
  { id: 'live', label: 'Live' },
  { id: 'sport', label: 'Sport' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'music', label: 'Music' },
  { id: 'news', label: 'News' },
  { id: 'search', label: 'Search' },
];

const conn = document.getElementById('conn') as any;
conn.onConnect = (url: string, port: number) => {
  console.log('connect to', url, port);
};

const grid = document.getElementById('grid') as any;
grid.title = 'Low latency live streams';
grid.items = sampleTiles();

grid.onTileClick = (d: any) => {
  player.open({ id: d.id, title: d.title, src: d.thumbnail });
};

const icons = document.getElementById('icons') as any;
icons.addEventListener('moqtv:account', () => alert('Account clicked'));
icons.addEventListener('moqtv:settings', () => alert('Settings clicked'));

// create/append player overlay
const player = document.createElement('moq-player-overlay') as any;
document.body.appendChild(player);

player.addEventListener('moqtv:opened', (e: any) => console.log('player opened', e.detail));
player.addEventListener('moqtv:closed', () => console.log('player closed'));

// Setup navigation: register focusable elements
const nav = document.createElement('moq-navigation') as any;
document.body.appendChild(nav);

// register sidebar items (from its shadow DOM)
const menuItems = (sidebar.shadowRoot as ShadowRoot).querySelectorAll('.item');
menuItems.forEach((el: HTMLElement) => nav.registerFocusable(el));

// register tiles (after grid rendered)
setTimeout(() => {
  const tileEls = document.querySelectorAll('moq-video-tile');
  tileEls.forEach((el: HTMLElement) => nav.registerFocusable(el));
  // register player controls as focusable when player appended
  const playBtn = (player.shadowRoot as ShadowRoot).getElementById('play') as HTMLElement;
  const pauseBtn = (player.shadowRoot as ShadowRoot).getElementById('pause') as HTMLElement;
  const closeBtn = (player.shadowRoot as ShadowRoot).getElementById('close') as HTMLElement;
  nav.registerFocusable(playBtn);
  nav.registerFocusable(pauseBtn);
  nav.registerFocusable(closeBtn);

  nav.focusItem(0);
}, 120);

nav.addEventListener('moqtv:back', () => {
  if ((player as any).visible) { player.close(); return; }
  console.log('Back pressed (no player)');
});

function sampleTiles() {
  return [
    { id:'1', title:'GLOBAL NEWS', description:'24 / 7 Breaking News', thumbnail:'https://picsum.photos/1280/720?random=1', latencyMs:245, live:true },
    { id:'2', title:'24H Le Mans', description:'Live Qualifying', thumbnail:'https://picsum.photos/1280/720?random=2', latencyMs:378, live:true },
    { id:'3', title:'Premier League Live', description:'Watch soccer', thumbnail:'https://picsum.photos/1280/720?random=3', latencyMs:132, live:true },
    { id:'4', title:'Esports Championship', description:'Finals', thumbnail:'https://picsum.photos/1280/720?random=4', latencyMs:160, live:true },
    { id:'5', title:'Top Hits Live', description:'DJ set', thumbnail:'https://picsum.photos/1280/720?random=5', latencyMs:78, live:true },
    { id:'6', title:'Weather Update', description:'Local forecast', thumbnail:'https://picsum.photos/1280/720?random=6', latencyMs:89, live:true },
  ];
}

export {};
