import { isAndroid, isWeb } from "@/constants/Platform";

type ShadowOptions = {
  color?: string;
  offset?: { width: number; height: number };
  radius?: number;
  opacity?: number;
  elevation?: number;
  depth?: 1 | 2 | 3 | 4 | 5; // optional preset system
};

// --- utils ---
function hexToRgb(hex: string) {
  let clean = hex.replace("#", "");

  // support short hex (#000)
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  return { r, g, b };
}

function rgba(hex: string, opacity: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// --- depth presets (feels like iOS / Material hybrid) ---
const WEB_DEPTHS: Record<number, string> = {
  1: `
        0px 1px 2px rgba(0,0,0,0.12),
        0px 1px 1px rgba(0,0,0,0.06)
    `,
  2: `
        0px 2px 4px rgba(0,0,0,0.12),
        0px 2px 2px rgba(0,0,0,0.08)
    `,
  3: `
        0px 4px 8px rgba(0,0,0,0.12),
        0px 4px 4px rgba(0,0,0,0.08)
    `,
  4: `
        0px 8px 16px rgba(0,0,0,0.14),
        0px 6px 6px rgba(0,0,0,0.10)
    `,
  5: `
        0px 12px 24px rgba(0,0,0,0.16),
        0px 8px 8px rgba(0,0,0,0.12)
    `,
};

// --- main ---
export function shadow_({
  color = "#000",
  offset = { width: 0, height: 2 },
  radius = 4,
  opacity = 0.2,
  elevation,
  depth,
}: ShadowOptions) {
  // 🌐 WEB
  if (isWeb) {
    if (depth) {
      return {
        boxShadow: WEB_DEPTHS[depth],
      };
    }

    const { width, height } = offset;

    // layered custom shadow (fallback if no depth)
    return {
      boxShadow: `
                ${width}px ${height}px ${radius}px ${rgba(color, opacity * 0.3)},
                ${width}px ${height * 2}px ${radius * 2}px ${rgba(color, opacity * 0.2)},
                ${width}px ${height * 4}px ${radius * 4}px ${rgba(color, opacity * 0.1)}
            `,
    };
  }

  // 🤖 ANDROID
  if (isAndroid) {
    const calculatedElevation =
      elevation !== undefined
        ? elevation
        : Math.ceil(radius * 0.6 + offset.height * 0.8 + opacity * 6);

    return {
      elevation: calculatedElevation,
    };
  }

  // 🍏 iOS
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowRadius: radius,
    shadowOpacity: opacity,
  };
}

// --- TEXT SHADOW ---
shadow_.text = function ({
  color = "#000",
  offset = { width: 0, height: 1 },
  radius = 2,
  opacity = 0.3,
}: ShadowOptions) {
  if (isWeb) {
    return {
      textShadow: `
                ${offset.width}px ${offset.height}px ${radius}px ${rgba(color, opacity)},
                ${offset.width}px ${offset.height * 2}px ${radius * 2}px ${rgba(color, opacity * 0.5)}
            `,
    };
  }

  return {
    textShadowColor: color,
    textShadowOffset: offset,
    textShadowRadius: radius,
  };
};
