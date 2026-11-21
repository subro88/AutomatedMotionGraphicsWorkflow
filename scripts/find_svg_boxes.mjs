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
  await page.setViewport({ width: 900, height: 900 });

  // Load Component.svg
  const svgPath = path.resolve('projects/incremental_backup_2008/assets/Component.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  // Load in an HTML page with canvas to analyze pixel colors
  await page.setContent(`
    <html>
      <body style="margin:0; padding:0; background:#000;">
        <canvas id="c" width="900" height="900"></canvas>
        <div id="svgContainer" style="display:none;">${svgContent}</div>
      </body>
    </html>
  `);

  const results = await page.evaluate(async () => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    
    // Draw SVG onto canvas at 900x900
    const svgElem = document.querySelector('svg');
    const svgString = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    await new Promise((res) => {
      img.onload = res;
      img.src = url;
    });
    
    ctx.drawImage(img, 0, 0, 900, 900);
    const imgData = ctx.getImageData(0, 0, 900, 900);
    const data = imgData.data;

    // Background color: #c7d9db -> R: 199, G: 217, B: 219
    const isBg = (r, g, b) => {
      return Math.abs(r - 199) < 15 && Math.abs(g - 217) < 15 && Math.abs(b - 219) < 15;
    };

    // Candidate regions in 450x450 coordinate space (multiply by 2 for 900x900):
    // Based on visual layout:
    // 1. Workstation monitor (top left): x ~ 50, y ~ 40
    // 2. Hard Drive (top mid-left): x ~ 170, y ~ 45
    // 3. Server Rack (top mid-right): x ~ 255, y ~ 45
    // 4. Tablet (top right): x ~ 345, y ~ 50
    // 5. Smartphone (left mid): x ~ 55, y ~ 145
    // 6. Router (mid upper): x ~ 185, y ~ 145
    // 7. Ethernet cable (right upper-mid): x ~ 345, y ~ 145
    // 8. Laptop (center): x ~ 155, y ~ 205
    // 9. Desktop tower (right mid): x ~ 340, y ~ 190
    // 10. Yellow Cloud (left lower-mid): x ~ 45, y ~ 245
    // 11. Folder on stand (bottom left): x ~ 55, y ~ 335
    // 12. Settings Gears (bottom left-mid): x ~ 125, y ~ 340
    // 13. Shield (bottom center): x ~ 190, y ~ 325
    // 14. Sync Arrows (bottom right-mid): x ~ 260, y ~ 345
    // 15. Maintenance Unit with Wrench (bottom right): x ~ 320, y ~ 340

    const targets = [
      { name: "workstation", approxX: 54, approxY: 49, approxW: 92, approxH: 82 },
      { name: "hard_drive", approxX: 176, approxY: 51, approxW: 49, approxH: 67 },
      { name: "server_rack", approxX: 260, approxY: 49, approxW: 55, approxH: 71 },
      { name: "tablet", approxX: 350, approxY: 57, approxW: 48, approxH: 63 },
      { name: "smartphone", approxX: 60, approxY: 150, approxW: 33, approxH: 61 },
      { name: "router", approxX: 189, approxY: 150, approxW: 71, approxH: 51 },
      { name: "ethernet_cable", approxX: 348, approxY: 148, approxW: 54, approxH: 24 },
      { name: "laptop", approxX: 160, approxY: 209, approxW: 129, approxH: 86 },
      { name: "server_tower", approxX: 347, approxY: 197, approxW: 54, approxH: 111 },
      { name: "cloud", approxX: 50, approxY: 251, approxW: 67, approxH: 40 },
      { name: "folder", approxX: 60, approxY: 340, approxW: 60, approxH: 55 },
      { name: "gears", approxX: 130, approxY: 344, approxW: 48, approxH: 42 },
      { name: "shield", approxX: 193, approxY: 333, approxW: 63, approxH: 63 },
      { name: "sync_arrows", approxX: 265, approxY: 350, approxW: 43, approxH: 39 },
      { name: "wrench_unit", approxX: 326, approxY: 344, approxW: 84, approxH: 51 }
    ];

    // For each target, refine bounding box by scanning non-bg pixels
    const refined = [];
    for (let t of targets) {
      const rx1 = Math.round(t.approxX * 2) - 8;
      const ry1 = Math.round(t.approxY * 2) - 8;
      const rx2 = Math.round((t.approxX + t.approxW) * 2) + 8;
      const ry2 = Math.round((t.approxY + t.approxH) * 2) + 8;

      let minX = 9999, minY = 9999, maxX = -1, maxY = -1;

      for (let y = Math.max(ry1, 0); y < Math.min(ry2, 900); y++) {
        for (let x = Math.max(rx1, 0); x < Math.min(rx2, 900); x++) {
          const idx = (y * 900 + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          // Skip dashed lines (gray pixels with width 1 or small dot cluster connecting to laptop)
          if (!isBg(r, g, b)) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX > minX && maxY > minY) {
        refined.push({
          name: t.name,
          svgX: (minX / 2.0).toFixed(1),
          svgY: (minY / 2.0).toFixed(1),
          svgW: ((maxX - minX + 1) / 2.0).toFixed(1),
          svgH: ((maxY - minY + 1) / 2.0).toFixed(1),
        });
      }
    }

    return refined;
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

main();
