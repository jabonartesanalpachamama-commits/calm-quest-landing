import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { getLocalSettings, applyCssVariablesForPalette, applyFontPair, saveLocalSettings } from "./lib/CmsFallbackData";
import { supabase } from "@/integrations/supabase/client";
import "./index.css";

const init = async () => {
  let settings = getLocalSettings();
  
  // If we don't have it in localStorage, fetch it from Supabase before rendering
  // This guarantees no FOUC (Flash of Unstyled Content) for first-time visitors
  if (!localStorage.getItem("cms_visual_identity")) {
    try {
      const { data } = await supabase.from("cms_settings").select("*");
      if (data && data.length > 0) {
        const parsed = data.find((i) => i.key === "visual_identity")?.value;
        if (parsed) {
          settings = parsed as any;
          saveLocalSettings(settings);
        }
      }
    } catch {
      // proceed with defaults if fetch fails
    }
  }

  // Apply CSS variables synchronously before React mounts
  applyCssVariablesForPalette(settings.palette);
  applyFontPair(settings.fontFamily);

  createRoot(document.getElementById("root")!).render(<App />);
};

init();
