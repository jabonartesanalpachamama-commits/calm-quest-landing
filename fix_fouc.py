import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content
    
    # 1. Update useState
    content = content.replace("useState<VisualIdentity | null>(null)", "useState<VisualIdentity>(() => getLocalSettings())")

    # 2. Update palette definition
    content = re.sub(r'const palette = settings\s*\?\s*\(?COLOR_PALETTES\[settings\.palette\] \|\| COLOR_PALETTES\.menta\)?\s*:\s*COLOR_PALETTES\.menta;', 'const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;', content)
    content = re.sub(r'const tempPalette = settings\s*\?\s*\(?COLOR_PALETTES\[settings\.palette\] \|\| COLOR_PALETTES\.menta\)?\s*:\s*COLOR_PALETTES\.menta;', 'const tempPalette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;', content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in glob.glob('src/pages/*.tsx'):
    process_file(f)

# Also update main.tsx to load CSS variables immediately on boot
main_ts = 'src/main.tsx'
with open(main_ts, 'r') as f:
    main_content = f.read()

if "getLocalSettings" not in main_content:
    imports = """import { getLocalSettings, applyCssVariablesForPalette, applyFontPair } from "./lib/CmsFallbackData";

// Apply global CSS variables synchronously before React mounts to prevent FOUC
const initialSettings = getLocalSettings();
applyCssVariablesForPalette(initialSettings.palette);
applyFontPair(initialSettings.fontFamily);

"""
    main_content = main_content.replace('import App from "./App.tsx";\n', 'import App from "./App.tsx";\n' + imports)
    with open(main_ts, 'w') as f:
        f.write(main_content)
    print("Updated main.tsx")

