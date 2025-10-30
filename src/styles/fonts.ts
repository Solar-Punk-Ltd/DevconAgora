// Dynamic font loading with Swarm hashes
const beeApiEndpoint = "bytes"

export function loadSwarmFonts(beeUrl: string): void {
  const styleElement = document.createElement("style");
  styleElement.id = "swarm-fonts";

  let cssText = "";

  // Poppins
  if (process.env.POPPINS_FONT_HASH) {
    const fontUrl = `${beeUrl}${beeApiEndpoint}/${process.env.POPPINS_FONT_HASH}`;
    cssText += `
@font-face {
  font-family: "Poppins";
  src: url("${fontUrl}") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;
  }

  // Inter - normal and bold
  if (process.env.INTER_FONT_HASH) {
    const fontUrl = `${beeUrl}${beeApiEndpoint}/${process.env.INTER_FONT_HASH}`;
    cssText += `
@font-face {
  font-family: "Inter";
  src: url("${fontUrl}") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Inter";
  src: url("${fontUrl}") format("truetype");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
`;
  }

  // Public Sans - normal, 600, 700
  if (process.env.PUBLICSANS_FONT_HASH) {
    const fontUrl = `${beeUrl}${beeApiEndpoint}/${process.env.PUBLICSANS_FONT_HASH}`;
    cssText += `
@font-face {
  font-family: "Public Sans";
  src: url("${fontUrl}") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Public Sans";
  src: url("${fontUrl}") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Public Sans";
  src: url("${fontUrl}") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;
  }

  // Bebas Neue
  if (process.env.BEBAS_FONT_HASH) {
    const fontUrl = `${beeUrl}${beeApiEndpoint}/${process.env.BEBAS_FONT_HASH}`;
    cssText += `
@font-face {
  font-family: "Bebas Neue";
  src: url("${fontUrl}") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`;
  }

  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
}

// Local font loading for development/non-Swarm builds
export function loadLocalFonts(): void {
  const styleElement = document.createElement("style");
  styleElement.id = "local-fonts";

  // Dynamically create font-face rules for local fonts
  // This avoids Vite processing the fonts.scss during build
  const cssText = `
@font-face {
  font-family: "Poppins";
  src: local("Poppins"), local("Poppins-Bold");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Inter";
  src: local("Inter"), local("Inter-Variable");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Inter";
  src: local("Inter"), local("Inter-Variable");
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: "Public Sans";
  src: local("Public Sans"), local("PublicSans");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Public Sans";
  src: local("Public Sans"), local("PublicSans");
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: "Public Sans";
  src: local("Public Sans"), local("PublicSans");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Bebas Neue";
  src: local("Bebas Neue"), local("BebasNeue-Regular");
  font-weight: 400;
  font-style: normal;
}
  `;

  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);
}

export function initializeFonts(isSwarm: boolean): void {
  const hasSwarmHashes = !!(
    process.env.POPPINS_FONT_HASH &&
    process.env.INTER_FONT_HASH &&
    process.env.PUBLICSANS_FONT_HASH &&
    process.env.BEBAS_FONT_HASH
  );

  const beeUrl = process.env.BEE_API_URL;

  if (beeUrl && hasSwarmHashes && isSwarm) {
    console.debug("Fetch fonts from Swarm");
    loadSwarmFonts(beeUrl);
  } else {
    console.debug("Using local system fonts");
    loadLocalFonts();
  }
}
