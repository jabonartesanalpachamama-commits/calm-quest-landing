import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if "CmsFallbackData" in content:
        print(f"Skipping {filepath}, already has CmsFallbackData")
        return

    # Add imports at the top
    imports_to_add = """import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
"""

    if 'import { useState, useEffect } from "react";' in content:
        # Remove it so we don't duplicate it
        content = content.replace('import { useState, useEffect } from "react";\n', '')

    content = imports_to_add + content

    # Find the component definition
    component_match = re.search(r'const (FreeClass[a-zA-Z]*) = \(\) => {', content)
    if not component_match:
        print(f"Could not find component definition in {filepath}")
        return

    component_name = component_match.group(1)
    
    # Inject the palette logic right after the component definition
    palette_logic = """
  const [settings, setSettings] = useState<VisualIdentity | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((item) => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch { /* use local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = settings
    ? COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta
    : COLOR_PALETTES.menta;
"""
    
    # Insert palette logic after the first '{' of the component definition
    insert_pos = component_match.end()
    content = content[:insert_pos] + palette_logic + content[insert_pos:]

    # Replace <main className="min-h-screen bg-background
    content = content.replace('<main className="min-h-screen bg-background ', '<main className={`min-h-screen ${palette.background} ${palette.foreground} ')
    content = content.replace('className="flex justify-center', 'className={`flex justify-center')
    
    # Also find any hardcoded text-primary or bg-card that we might want to let the palette override,
    # but the applyCssVariablesForPalette injects standard --background and --primary into CSS variables,
    # so actually standard Tailwind classes WILL use the palette colors! 
    # That is the beauty of it! We just need to make sure `applyCssVariablesForPalette` runs.

    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated {filepath}")

for f in ['src/pages/FreeClass.tsx', 'src/pages/FreeClassSlots.tsx', 'src/pages/FreeClassTime.tsx']:
    process_file(f)

