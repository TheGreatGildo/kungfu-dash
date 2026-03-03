import React, { useRef, useEffect } from 'react';

/* ── 6×8 bitmap font ─────────────────────────────────────── */
const GLYPHS = {};
function def(ch, ...rows) {
  GLYPHS[ch] = rows.map(r =>
    r.split('').map(c => (c === '#' ? 1 : 0)),
  );
}

def('A','.####.','##..##','##..##','######','##..##','##..##','##..##','......');
def('B','#####.','##..##','##..##','#####.','##..##','##..##','#####.','......');
def('C','.####.','##..##','##....','##....','##....','##..##','.####.','......');
def('D','####..','##.##.','##..##','##..##','##..##','##.##.','####..','......');
def('E','######','##....','##....','#####.','##....','##....','######','......');
def('F','######','##....','##....','#####.','##....','##....','##....','......');
def('G','.####.','##..##','##....','##.###','##..##','##..##','.####.','......');
def('H','##..##','##..##','##..##','######','##..##','##..##','##..##','......');
def('I','######','..##..','..##..','..##..','..##..','..##..','######','......');
def('J','..####','....##','....##','....##','##..##','##..##','.####.','......');
def('K','##..##','##.##.','####..','###...','####..','##.##.','##..##','......');
def('L','##....','##....','##....','##....','##....','##....','######','......');
def('M','##..##','######','######','##.###','##..##','##..##','##..##','......');
def('N','##..##','###.##','######','##.###','##..##','##..##','##..##','......');
def('O','.####.','##..##','##..##','##..##','##..##','##..##','.####.','......');
def('P','#####.','##..##','##..##','#####.','##....','##....','##....','......');
def('Q','.####.','##..##','##..##','##..##','##.##.','##.##.','.###.#','......');
def('R','#####.','##..##','##..##','#####.','####..','##.##.','##..##','......');
def('S','.####.','##..##','##....','.####.','....##','##..##','.####.','......');
def('T','######','..##..','..##..','..##..','..##..','..##..','..##..','......');
def('U','##..##','##..##','##..##','##..##','##..##','##..##','.####.','......');
def('V','##..##','##..##','##..##','##..##','##..##','.####.','..##..','......');
def('W','##..##','##..##','##..##','##.###','######','######','##..##','......');
def('X','##..##','##..##','.####.','..##..','.####.','##..##','##..##','......');
def('Y','##..##','##..##','.####.','..##..','..##..','..##..','..##..','......');
def('Z','######','....##','...##.','..##..','.##...','##....','######','......');
def('0','.####.','##..##','##.###','######','###.##','##..##','.####.','......');
def('1','..##..','.###..','..##..','..##..','..##..','..##..','######','......');
def('2','.####.','##..##','....##','...##.','.##...','##....','######','......');
def('3','######','...##.','.##...','.####.','....##','##..##','.####.','......');
def('4','...##.','..###.','.####.','##.##.','######','...##.','...##.','......');
def('5','######','##....','#####.','....##','....##','##..##','.####.','......');
def('6','.####.','##....','#####.','##..##','##..##','##..##','.####.','......');
def('7','######','....##','...##.','..##..','..##..','..##..','..##..','......');
def('8','.####.','##..##','##..##','.####.','##..##','##..##','.####.','......');
def('9','.####.','##..##','##..##','.#####','....##','....##','.####.','......');
def(' ','......','......','......','......','......','......','......','......');

/* ── character density pools ──────────────────────────────── */
const DENSITY = [
  ['.', ',', "'", '`'],
  [':', '-', ';', '~', '=', '+'],
  ['/', '\\', '|', '*', 'x', '<', '>'],
  ['@', '#', '%', '&', '$', 'W', 'M'],
];
const EDGE_CHARS = ['.', ',', ':', ';', '-'];
const GLITCH_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '{', '}', '|', '<', '>', '?', '~'];

const EDGE_SIZES = [1, 0.85, 0.70, 0.55, 0.40];

const PAL = {
  c: ['#0a3a0a', '#008800', '#00cc00', '#00ff00'],
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

/* ── rasterize text to boolean grid ───────────────────────── */
function rasterize(text) {
  const lines = text.toUpperCase().split('\n');
  const charW = 6, charH = 8;
  const maxCols = Math.max(...lines.map(l => l.length));
  const rows = lines.length;
  const gridW = maxCols * charW;
  const gridH = rows * charH;
  const grid = Array.from({ length: gridH }, () => new Uint8Array(gridW));

  lines.forEach((line, li) => {
    for (let ci = 0; ci < line.length; ci++) {
      const glyph = GLYPHS[line[ci]];
      if (!glyph) continue;
      for (let gy = 0; gy < charH; gy++) {
        for (let gx = 0; gx < charW; gx++) {
          grid[li * charH + gy][ci * charW + gx] = glyph[gy][gx];
        }
      }
    }
  });
  return { grid, gridW, gridH };
}

/* ── adaptive subdivision ─────────────────────────────────── */
function calcSub(gridW, gridH, canvasW, canvasH) {
  const textW = canvasW * 0.90;
  const textH = canvasH * 0.72;
  const minCell = 7;
  for (let sub = 5; sub >= 2; sub--) {
    const cellW = textW / (gridW * sub);
    const cellH = textH / (gridH * sub);
    const cell = Math.min(cellW, cellH);
    if (cell >= minCell) return { sub, cell };
  }
  const cell = Math.min(textW / (gridW * 2), textH / (gridH * 2));
  return { sub: 2, cell: Math.max(cell, 6) };
}

/* ── build cells ──────────────────────────────────────────── */
function buildCells(text, pal, W, H) {
  const { grid, gridW, gridH } = rasterize(text);
  const { sub, cell } = calcSub(gridW, gridH, W, H);

  const totalW = gridW * sub * cell;
  const totalH = gridH * sub * cell;
  const ox = (W - totalW) / 2;
  const oy = (H - totalH) / 2;
  const cx = W / 2;
  const cy = H / 2;

  const cells = [];

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (!grid[gy][gx]) continue;
      for (let sy = 0; sy < sub; sy++) {
        for (let sx = 0; sx < sub; sx++) {
          const px = ox + (gx * sub + sx) * cell;
          const py = oy + (gy * sub + sy) * cell;

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
          // Only count edge for sub-cells at the grid boundary
          const isSubEdge = sx === 0 || sx === sub - 1 || sy === 0 || sy === sub - 1;
          const edgeCount = isSubEdge ? Math.min(edges, 4) : 0;
          const sizeMul = EDGE_SIZES[edgeCount];

          // directional lighting
          const nx = (gx * sub + sx) / (gridW * sub);
          const ny = (gy * sub + sy) / (gridH * sub);
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
            // assembly
            startX: px + Math.cos(angle) * flyDist,
            startY: py + Math.sin(angle) * flyDist,
            stagger,
            // drift
            driftPhaseX: Math.random() * Math.PI * 2,
            driftPhaseY: Math.random() * Math.PI * 2,
            driftFreqX: 0.3 + Math.random() * 0.4,
            driftFreqY: 0.3 + Math.random() * 0.4,
          });
        }
      }
    }
  }

  // Sort by size descending
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

        // Ambient drift after assembly
        if (assemblyT >= 1) {
          x += Math.sin(time * c.driftFreqX + c.driftPhaseX) * 1.5;
          y += Math.cos(time * c.driftFreqY + c.driftPhaseY) * 1.5;
        }

        if (t <= 0) continue;

        const fontSize = c.size * 0.82;
        if (fontSize < 3) continue;

        // Check glitch
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
        height: '240px',
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
