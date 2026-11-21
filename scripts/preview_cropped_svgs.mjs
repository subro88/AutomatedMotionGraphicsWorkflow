import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  const svgNames = [
    "workstation", "hard_drive", "server_rack", "tablet", "smartphone",
    "router", "ethernet_cable", "laptop", "server_tower", "cloud",
    "folder", "gears", "shield", "sync_arrows", "wrench_unit"
  ];

  const svgDir = path.resolve('projects/incremental_backup_2008/assets/svg_test');
  const cardsHtml = svgNames.map(name => {
    const file = path.join(svgDir, `${name}.svg`);
    const svgCode = fs.readFileSync(file, 'utf8');
    return `
      <div style="background:#ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 260px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="font-family: sans-serif; font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 8px;">${name}</div>
        <div style="flex:1; width: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 10px; overflow: hidden;">
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
        <h1 style="font-family: sans-serif; font-size: 20px; margin-bottom: 16px; color: #0f172a;">Cropped SVG Elements Visual Inspection Grid</h1>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px;">
          ${cardsHtml}
        </div>
      </body>
    </html>
  `);

  const outPath = path.resolve('projects/incremental_backup_2008/assets/svg_test/all_crops_preview.png');
  await page.screenshot({ path: outPath });
  await browser.close();

  // Copy to brain directory for artifact access
  const brainPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\40a72bb6-00e8-4995-b87c-88770177cb82\\all_crops_preview.png';
  fs.copyFileSync(outPath, brainPath);
  console.log(`Saved screenshot to ${outPath} and ${brainPath}`);
}

main().catch(console.error);
