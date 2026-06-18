import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { getLocalSettings, applyCssVariablesForPalette, applyFontPair } from "./lib/CmsFallbackData";

// Apply global CSS variables synchronously before React mounts to prevent FOUC
const initialSettings = getLocalSettings();
applyCssVariablesForPalette(initialSettings.palette);
applyFontPair(initialSettings.fontFamily);

import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
