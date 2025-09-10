// Dynamic font loading with Swarm hashes
export function loadSwarmFonts(beeUrl: string): void {
  const fonts = [
    {
      family: "Poppins",
      hash: process.env.POPPINS_FONT_HASH,
      weights: ["normal"],
    },
    {
      family: "Inter",
      hash: process.env.INTER_FONT_HASH,
      weights: ["normal", "bold"],
    },
    {
      family: "Public Sans",
      hash: process.env.PUBLICSANS_FONT_HASH,
      weights: ["normal", "600", "700"],
    },
    {
      family: "Bebas Neue",
      hash: process.env.BEBAS_FONT_HASH,
      weights: ["400"],
    },
  ];

  const styleElement = document.createElement("style");
  styleElement.id = "swarm-fonts";

  let cssText = "";

  fonts.forEach((font) => {
    if (font.hash) {
      const fontUrl = `${beeUrl}/bzz/${font.hash}/`;

      font.weights.forEach((weight) => {
        cssText += `
@font-face {
  font-family: "${font.family}";
  src: url("${fontUrl}") format("truetype");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}
`;
      });
    }
  });

  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
}

export function initializeFonts(): void {
  const hasSwarmHashes = !!(
    process.env.POPPINS_FONT_HASH &&
    process.env.INTER_FONT_HASH &&
    process.env.PUBLICSANS_FONT_HASH &&
    process.env.BEBAS_FONT_HASH
  );

  const beeUrl = process.env.BEE_API_URL;

  if (beeUrl && hasSwarmHashes) {
    console.debug("Fetch fonts from Swarm");
    loadSwarmFonts(beeUrl);
  } else {
    console.debug("Using local font fallbacks");
  }
}
