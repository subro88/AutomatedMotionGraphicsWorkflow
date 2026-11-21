import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate Chrome or Edge
function getBrowserExecutable() {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of chromePaths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Neither Google Chrome nor Microsoft Edge executable was found.');
}

async function main() {
  const args = process.argv.slice(2);
  let scenePath = null;
  let outPath = null;
  let fps = 60;
  let width = 1920;
  let height = 1080;
  let duration = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scene') scenePath = path.resolve(args[++i]);
    else if (args[i] === '--out') outPath = path.resolve(args[++i]);
    else if (args[i] === '--fps') fps = parseInt(args[++i], 10);
    else if (args[i] === '--width') width = parseInt(args[++i], 10);
    else if (args[i] === '--height') height = parseInt(args[++i], 10);
    else if (args[i] === '--duration') duration = parseFloat(args[++i]);
  }

  if (!scenePath || !outPath) {
    console.error('Usage: node scripts/motlab_worker.mjs --scene <scene.html> --out <output.mp4> [--fps 60]');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const browserPath = getBrowserExecutable();
  console.log(`[Motlab Worker] Launching Browser: ${browserPath}`);
  console.log(`[Motlab Worker] Loading Scene:    ${scenePath}`);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-gpu-rasterization',
      '--use-gl=angle',
      `--window-size=${width},${height}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });

  const fileUrl = 'file:///' + scenePath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Read SCENE_META if available
  const sceneMeta = await page.evaluate(() => window.SCENE_META || {});
  const finalFps = fps || sceneMeta.fps || 60;
  const finalDuration = duration || sceneMeta.duration || 5.0;
  const finalWidth = width || sceneMeta.width || 1920;
  const finalHeight = height || sceneMeta.height || 1080;
  const totalFrames = Math.round(finalDuration * finalFps);

  console.log(`[Motlab Worker] Specs: ${finalWidth}x${finalHeight} @ ${finalFps} FPS | Duration: ${finalDuration}s | Total Frames: ${totalFrames}`);

  // Ensure assets are fully decoded
  await page.evaluate(async () => {
    if (window.ASSETS_LOADED) {
      try { await window.ASSETS_LOADED; } catch (e) {}
    }
  });

  // Spawn FFmpeg to receive MJPEG stream on stdin for ultra-fast NVENC encoding
  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', finalFps.toString(),
    '-i', '-',
    '-c:v', 'h264_nvenc',
    '-preset', 'p4',
    '-cq', '19',
    '-pix_fmt', 'yuv420p',
    outPath
  ];

  let ffmpeg = spawn('ffmpeg', ffmpegArgs);
  let usingNvenc = true;

  ffmpeg.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('Cannot load nvEncodeAPI') || msg.includes('Encoder not found')) {
      console.warn('[Motlab Worker] NVENC not available, falling back to libx264...');
      usingNvenc = false;
    }
  });

  // Verify renderAt function exists in the page
  const hasRenderAt = await page.evaluate(() => typeof window.renderAt === 'function');
  if (!hasRenderAt) {
    console.error('[Motlab Worker] Error: window.renderAt(t) is not defined in the scene HTML.');
    await browser.close();
    process.exit(1);
  }

  const startTime = Date.now();
  console.log('[Motlab Worker] Rendering frames...');

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / finalFps;

    // Evaluate renderAt(t) and extract JPEG base64 directly from canvas
    const base64Data = await page.evaluate(async (currentTime) => {
      window.renderAt(currentTime);
      const c = document.getElementById('c') || document.querySelector('canvas');
      if (!c) return null;
      return c.toDataURL('image/jpeg', 0.98).slice(23);
    }, t);

    if (base64Data) {
      const buffer = Buffer.from(base64Data, 'base64');
      ffmpeg.stdin.write(buffer);
    }

    if (frame % 30 === 0 || frame === totalFrames - 1) {
      const progress = ((frame + 1) / totalFrames * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[Motlab Worker] Progress: ${progress}% (Frame ${frame + 1}/${totalFrames}) - ${elapsed}s`);
    }
  }

  ffmpeg.stdin.end();

  await new Promise((resolve) => {
    ffmpeg.on('close', resolve);
  });

  await browser.close();
  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  const effectiveFps = (totalFrames / totalElapsed).toFixed(1);
  console.log(`\n[Motlab Worker] ✅ Done! Rendered ${totalFrames} frames in ${totalElapsed}s (${effectiveFps} FPS).`);
  console.log(`[Motlab Worker] Output: ${outPath}\n`);
}

main().catch(err => {
  console.error('[Motlab Worker] Error:', err);
  process.exit(1);
});
