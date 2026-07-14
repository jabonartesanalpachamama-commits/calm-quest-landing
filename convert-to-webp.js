const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/assets');
const files = fs.readdirSync(dir);

async function convert() {
  for (const file of files) {
    if (file.match(/\.(png|jpe?g)$/i)) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const output = path.join(dir, `${name}.webp`);
      
      console.log(`Converting ${file} to ${name}.webp...`);
      await sharp(path.join(dir, file))
        .webp({ quality: 80 })
        .toFile(output);
      
      // Delete the original file to clean up (Wait, it's safer to delete later or through git rm, but let's just delete the originals here so we can update references in code.)
      // No, let's keep originals in case of issues, wait, the goal says "convierte las imagenes a formato webp", usually that implies replacing. We'll delete them after git tracks the new ones.
    }
  }
}
convert().catch(console.error);
