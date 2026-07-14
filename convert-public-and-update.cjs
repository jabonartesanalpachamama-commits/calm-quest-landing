const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

async function convertDir(dir) {
  const files = fs.readdirSync(dir);
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

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceInFiles(filePath);
    } else if (filePath.match(/\.(tsx?|jsx?)$/)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      const original = content;
      // replace image imports
      content = content.replace(/from\s+["'](@\/assets\/[^"']+)\.(jpg|jpeg|png)["']/g, 'from "$1.webp"');
      // replace static src attributes (like in public folder)
      content = content.replace(/src=["'](\/[^"']+)\.(jpg|jpeg|png)["']/g, 'src="$1.webp"');
      // replace background urls
      content = content.replace(/url\(['"]?(\/src\/assets\/[^'"]+)\.(jpg|jpeg|png)['"]?\)/g, 'url(\'$1.webp\')');
      
      if (content !== original) {
        console.log(`Updated references in ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  }
}

async function main() {
  await convertDir(publicDir);
  replaceInFiles(srcDir);
  console.log("Done");
}

main().catch(console.error);
