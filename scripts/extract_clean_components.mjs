import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

// Component slice definitions (inclusive start, inclusive end)
const COMPONENT_RANGES = {
  hard_drive: [59, 75],
  server_rack: [76, 93],
  server_tower: [94, 112],
  router: [113, 126],
  laptop: [128, 341],
  shield: [342, 352],
  workstation: [353, 362],
  tablet: [363, 368],
  smartphone: [369, 374],
  cloud: [375, 379],
  wrench_unit: [380, 389],
  ethernet_cable: [390, 421],
  folder: [422, 427],
  gears: [428, 429],
  sync_arrows: [430, 432]
};

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const svgPath = path.resolve('projects/incremental_backup_2008/assets/Component.svg');
  const svgRaw = fs.readFileSync(svgPath, 'utf8');

  // Extract defs
  const defsMatch = svgRaw.match(/<defs>[\s\S]*?<\/defs>/);
  const defsContent = defsMatch ? defsMatch[0] : '';

  // Parse XML elements in page DOM
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <div id="container">${svgRaw}</div>
      </body>
    </html>
  `);

  const componentData = await page.evaluate((ranges) => {
    const svg = document.querySelector('#container svg');
    const children = Array.from(svg.children);
    const results = {};

    for (const [name, [start, end]] of Object.entries(ranges)) {
      // Create a temporary SVG with just defs and these elements to measure exact BBox
      const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tempSvg.setAttribute('viewBox', '0 0 450 450');
      tempSvg.style.position = 'absolute';
      tempSvg.style.visibility = 'hidden';
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Clone elements
      const elementsXml = [];
      for (let i = start; i <= end; i++) {
        if (children[i]) {
          g.appendChild(children[i].cloneNode(true));
          elementsXml.push(children[i].outerHTML);
        }
      }
      
      tempSvg.appendChild(g);
      document.body.appendChild(tempSvg);
      
      const bbox = g.getBBox();
      document.body.removeChild(tempSvg);

      // Add small 2px padding for anti-aliasing / stroke width
      const pad = 2;
      const x = Math.max(0, bbox.x - pad);
      const y = Math.max(0, bbox.y - pad);
      const width = bbox.width + pad * 2;
      const height = bbox.height + pad * 2;

      results[name] = {
        bbox: {
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          width: Number(width.toFixed(2)),
          height: Number(height.toFixed(2))
        },
        elements: elementsXml
      };
    }

    return results;
  }, COMPONENT_RANGES);

  const outDirs = [
    path.resolve('projects/incremental_backup_2008/assets/svg_test'),
    path.resolve('public/incremental_backup/svg')
  ];

  outDirs.forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  for (const [name, data] of Object.entries(componentData)) {
    const { bbox, elements } = data;
    const cleanSvg = `<svg id="${name}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">
${defsContent}
${elements.join('\n')}
</svg>`;

    outDirs.forEach(d => {
      fs.writeFileSync(path.join(d, `${name}.svg`), cleanSvg, 'utf8');
    });
  }

  console.log('Successfully generated isolated SVGs for all 15 components!');

  // Now generate a clean visual inspection preview grid
  const svgNames = Object.keys(COMPONENT_RANGES);
  const cardsHtml = svgNames.map(name => {
    const file = path.join(outDirs[0], `${name}.svg`);
    const svgCode = fs.readFileSync(file, 'utf8');
    const { bbox } = componentData[name];
    return `
      <div style="background:#ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 260px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="font-family: sans-serif; font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 4px;">${name}</div>
        <div style="font-family: monospace; font-size: 10px; color: #64748b; margin-bottom: 8px;">${bbox.width}x${bbox.height}</div>
        <div style="flex:1; width: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 12px; overflow: hidden;">
          <div style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center;">
            ${svgCode}
          </div>
        </div>
      </div>
    `;
  }).join('');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          svg { width: 100%; height: 100%; object-fit: contain; }
        </style>
      </head>
      <body style="margin: 0; padding: 24px; background: #f1f5f9;">
        <h1 style="font-family: sans-serif; font-size: 22px; margin-bottom: 4px; color: #0f172a;">Clean Isolated Vector Components (Zero Connectors, Zero Overlap)</h1>
        <p style="font-family: sans-serif; font-size: 13px; margin-bottom: 16px; color: #64748b;">Every component extracted with its exact element tree and mathematical getBBox() boundary</p>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;">
          ${cardsHtml}
        </div>
      </body>
    </html>
  `);

  const previewPath = path.resolve('projects/incremental_backup_2008/assets/svg_test/clean_components_preview.png');
  await page.screenshot({ path: previewPath });
  const brainPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\40a72bb6-00e8-4995-b87c-88770177cb82\\clean_components_preview.png';
  fs.copyFileSync(previewPath, brainPath);

  await browser.close();
  console.log(`Saved preview to ${previewPath} and ${brainPath}`);
}

main().catch(console.error);
