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
    }
  }
}
convert().catch(console.error);
