// Fonts are now loaded via fonts.scss from /public/assets/
// This file is kept for potential future font loading logic
export function initializeFonts(_isSwarm: boolean): void {
  // Fonts are loaded via fonts.scss which references files in /public/assets/
  // These are served as static assets, just like images
  console.debug("Fonts loaded from bundled assets");
}
