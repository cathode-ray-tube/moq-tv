import "./components/tv-grid.js";
import "./components/navigation.js";
import "./components/player-overlay.js";
import "./components/sidebar-menu.js";
import "./components/url-port-input.js";
import "./components/icon-bar.js";
import "./components/video-tile.js";
import "./components/video-grid.js";

window.addEventListener("DOMContentLoaded", () => {
  // Ensure tv-grid is laid out early
  const grid = document.getElementById("rootGrid");
  grid?.dispatchEvent(new Event("resize"));

  // Optional: you can set up more developer wiring here,
  // e.g. reacting to focus changes, categories, or pulling real channel data.
});
