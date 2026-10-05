import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  VisualIdentity, COLOR_PALETTES, getLocalSettings, applyCssVariablesForPalette, applyFontPair,
} from "@/lib/CmsFallbackData";

/** Carga la identidad visual del CMS (con respaldo local) y devuelve settings + paleta. */
export const useVisualSettings = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());
  useEffect(() => {
    (async () => {
      let active = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        const parsed = data?.find((i) => i.key === "visual_identity")?.value;
        if (parsed) active = parsed as unknown as VisualIdentity;
      } catch { /* local fallback */ }
      applyCssVariablesForPalette(active.palette);
      applyFontPair(active.fontFamily);
      setSettings(active);
    })();
  }, []);
  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;
  return { settings, palette };
};
