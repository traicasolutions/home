const fs = require('fs');
const path = require('path');

const adsDir = path.resolve(process.cwd(), 'public', 'ads');
const outFile = path.resolve(adsDir, 'ads.json');

try {
  const entries = fs.readdirSync(adsDir, { withFileTypes: true })
    .filter((d) => d.isFile() && /\.(png|jpe?g|svg)$/i.test(d.name))
    .map((d) => d.name)
    .sort();

  fs.writeFileSync(outFile, JSON.stringify(entries, null, 2));
  console.log('Generated', outFile);
} catch (err) {
  console.error('Failed to generate ads.json:', err.message);
  process.exit(1);
}
