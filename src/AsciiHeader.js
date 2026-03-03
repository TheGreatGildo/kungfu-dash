import React, { useRef, useEffect } from 'react';

/* ── character density pools ──────────────────────────────── */
const DENSITY = [
  ['.', ',', "'", '`'],
  [':', '-', ';', '~', '=', '+'],
  ['/', '\\', '|', '*', 'x', '<', '>'],
  ['@', '#', '%', '&', '$', 'W', 'M'],
];
const EDGE_CHARS = ['.', ',', ':', ';', '-'];
const GLITCH_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}', '|', '<', '>', '?', '~'];

const EDGE_SIZES = [1, 0.95, 0.88, 0.78, 0.65];

const PAL = {
  c: ['#005500', '#009900', '#00dd00', '#00ff00'],
  a: '#ffff00',
};

/* ── helpers ───────────────────────────────────────────────── */
const clamp = (lo, hi, v) => Math.max(lo, Math.min(hi, v));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/* ── rasterize text via canvas font renderer ──────────────── */
function rasterize(text, targetGridW) {
  const upper = text.toUpperCase();
  const tmp = document.createElement('canvas');
  const tCtx = tmp.getContext('2d');

  // Render text large, then downsample to target grid width
  const fontSize = 200;
  tCtx.font = `bold ${fontSize}px "Courier New", Consolas, monospace`;
  const metrics = tCtx.measureText(upper);
  const textW = Math.ceil(metrics.width);
  const textH = Math.ceil(fontSize * 1.2);

  tmp.width = textW;
  tmp.height = textH;
  tCtx.font = `bold ${fontSize}px "Courier New", Consolas, monospace`;
  tCtx.fillStyle = '#fff';
  tCtx.textBaseline = 'top';
  tCtx.fillText(upper, 0, fontSize * 0.1);

  const imgData = tCtx.getImageData(0, 0, textW, textH);
  const pixels = imgData.data;

  // Downsample to grid
  const gridW = targetGridW;
  const gridH = Math.max(1, Math.round(gridW * (textH / textW)));
  const cellPxW = textW / gridW;
  const cellPxH = textH / gridH;

  const grid = Array.from({ length: gridH }, () => new Uint8Array(gridW));

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      // Sample center of each cell
      const px = Math.floor(gx * cellPxW + cellPxW / 2);
      const py = Math.floor(gy * cellPxH + cellPxH / 2);
      const idx = (py * textW + px) * 4;
      if (pixels[idx + 3] > 80) {
        grid[gy][gx] = 1;
      }
    }
  }

  return { grid, gridW, gridH };
}

/* ── build cells ──────────────────────────────────────────── */
function buildCells(text, pal, W, H) {
  // Target ~8px cells, determine grid width from canvas size
  const targetCell = 9;
  const usableW = W * 0.88;
  const targetGridW = Math.floor(usableW / targetCell);
  const { grid, gridW, gridH } = rasterize(text, targetGridW);

  const cell = usableW / gridW;
  const totalW = gridW * cell;
  const totalH = gridH * cell;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  const cx = W / 2;
  const cy = H / 2;

  const cells = [];

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (!grid[gy][gx]) continue;

      const px = ox + gx * cell;
      const py = oy + gy * cell;

      // edge detection (8-neighbor)
      let edges = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ngy = gy + dy, ngx = gx + dx;
          if (ngy < 0 || ngy >= gridH || ngx < 0 || ngx >= gridW || !grid[ngy][ngx]) {
            edges++;
          }
        }
      }
      const edgeCount = Math.min(edges, 4);
      const sizeMul = EDGE_SIZES[edgeCount];

      // directional lighting
      const nx = gx / gridW;
      const ny = gy / gridH;
      const light = 1 - (nx * 0.35 + ny * 0.55);
      const noise = (Math.random() - 0.5) * 0.22;
      const ci = clamp(0, 3, Math.floor((light + noise) * 3.99));

      const isEdge = edgeCount >= 3;
      const pool = isEdge ? EDGE_CHARS : DENSITY[ci];
      const ch = pick(pool);

      // assembly animation
      const distFromCenter = Math.hypot(px - cx, py - cy);
      const maxDist = Math.hypot(W, H) / 2;
      const angle = Math.random() * Math.PI * 2;
      const flyDist = 400 + Math.random() * 350;
      const stagger = (distFromCenter / maxDist) * 0.6 + Math.random() * 0.15;

      cells.push({
        x: px, y: py,
        size: cell * sizeMul,
        ch, ci, pool,
        color: pal.c[ci],
        startX: px + Math.cos(angle) * flyDist,
        startY: py + Math.sin(angle) * flyDist,
        stagger,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftFreqX: 0.3 + Math.random() * 0.4,
        driftFreqY: 0.3 + Math.random() * 0.4,
      });
    }
  }

  cells.sort((a, b) => b.size - a.size);
  return cells;
}

/* ── React component ──────────────────────────────────────── */
const AsciiHeader = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    offscreenRef.current = offscreen;

    let W, H, cells;
    let animStart = null;
    let lastCycle = 0;
    let glitchCooldown = 4000 + Math.random() * 6000;
    let lastGlitch = 0;
    let glitchCells = [];
    let mouseX = 0.5, mouseY = 0.5;
    let rafId;
    const ASSEMBLY_DURATION = 1800;

    function resize() {
      const rect = container.getBoundingClientRect();
      W = Math.floor(rect.width * window.devicePixelRatio);
      H = Math.floor(rect.height * window.devicePixelRatio);
      canvas.width = W;
      canvas.height = H;
      offscreen.width = W;
      offscreen.height = H;
      cells = buildCells('ALCHEMIX', PAL, W, H);
      animStart = performance.now();
      lastCycle = 0;
      lastGlitch = 0;
    }

    resize();
    window.addEventListener('resize', resize);

    function handleMouse(e) {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    }
    container.addEventListener('mousemove', handleMouse);

    function render(now) {
      rafId = requestAnimationFrame(render);
      if (!cells || !cells.length) return;

      const elapsed = now - animStart;
      const assemblyT = Math.min(elapsed / ASSEMBLY_DURATION, 1);

      // Character cycling (~3-5% per tick, every 80ms)
      if (now - lastCycle > 80) {
        lastCycle = now;
        const count = Math.ceil(cells.length * (0.03 + Math.random() * 0.02));
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * cells.length);
          const c = cells[idx];
          c.ch = pick(c.pool);
        }
      }

      // Glitch pulses
      if (now - lastGlitch > glitchCooldown) {
        lastGlitch = now;
        glitchCooldown = 4000 + Math.random() * 6000;
        const rightCells = cells.filter(c => c.x > W * 0.8);
        const count = Math.min(rightCells.length, 3 + Math.floor(Math.random() * 8));
        glitchCells = [];
        for (let i = 0; i < count; i++) {
          const c = rightCells[Math.floor(Math.random() * rightCells.length)];
          if (c) glitchCells.push({ cell: c, until: now + 100 + Math.random() * 100 });
        }
      }

      // Clear offscreen
      offCtx.clearRect(0, 0, W, H);

      // Draw cells
      const time = now / 1000;
      for (const c of cells) {
        const t = clamp(0, 1, (assemblyT - c.stagger * 0.7) / (1 - c.stagger * 0.7 + 0.001));
        const eased = easeOutBack(t);

        let x = c.startX + (c.x - c.startX) * eased;
        let y = c.startY + (c.y - c.startY) * eased;

        if (assemblyT >= 1) {
          x += Math.sin(time * c.driftFreqX + c.driftPhaseX) * 1.5;
          y += Math.cos(time * c.driftFreqY + c.driftPhaseY) * 1.5;
        }

        if (t <= 0) continue;

        const fontSize = c.size * 0.82;
        if (fontSize < 3) continue;

        const glitchEntry = glitchCells.find(g => g.cell === c && now < g.until);
        const ch = glitchEntry ? pick(GLITCH_CHARS) : c.ch;
        const color = glitchEntry ? PAL.a : c.color;

        offCtx.font = `bold ${fontSize}px "Courier New", Consolas, "Liberation Mono", monospace`;
        offCtx.fillStyle = color;
        offCtx.globalAlpha = t;
        offCtx.fillText(ch, x, y + c.size * 0.75);
      }
      offCtx.globalAlpha = 1;

      // Composite to main canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      // Glow layer
      ctx.save();
      ctx.filter = 'blur(3px)';
      ctx.globalAlpha = 0.35;
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();

      // Sharp layer
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.drawImage(offscreen, 0, 0);
      ctx.restore();

      // CRT scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      for (let sy = 0; sy < H; sy += 3) {
        ctx.fillRect(0, sy, W, 1);
      }

      // Vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.85);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Mouse parallax
      const rx = (mouseY - 0.5) * 3;
      const ry = (mouseX - 0.5) * -3;
      canvas.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '350px',
        position: 'relative',
        overflow: 'hidden',
        background: '#000000',
        borderRadius: '4px',
        marginBottom: '20px',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};

export default AsciiHeader;
