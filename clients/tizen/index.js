import "./components/tv-grid.ts";
import "./components/navigation.ts";
import "./components/player-overlay.ts";
import "./components/sidebar-menu.ts";
import "./components/url-port-input.ts";
import "./components/icon-bar.ts";
import "./components/video-tile.ts";
import "./components/video-grid.ts";

window.addEventListener("DOMContentLoaded", () => {
  // Ensure tv-grid is laid out early
  const grid = document.getElementById("rootGrid");
  grid?.dispatchEvent(new Event("resize"));

  // Optional: you can set up more developer wiring here,
  // e.g. reacting to focus changes, categories, or pulling real channel data.
});
