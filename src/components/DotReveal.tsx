import { useEffect, useRef, useCallback } from "react";

interface DotRevealProps {
  color?: string;
  secondaryColor?: string;
  cellSize?: number;
  dotSize?: number;
  duration?: number;
  onComplete?: () => void;
}

export default function DotReveal({
  color = "#3BA778",
  secondaryColor = "#1D60AB",
  cellSize = 12,
  dotSize = 0.6,
  duration = 2.0,
  onComplete,
}: DotRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;

    const cellPx = cellSize * dpr;
    const cols = Math.ceil(w / cellPx);
    const rows = Math.ceil(h / cellPx);
    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.hypot(cx, cy);
    const total = cols * rows;

    const r1 = parseInt(color.slice(1, 3), 16);
    const g1 = parseInt(color.slice(3, 5), 16);
    const b1 = parseInt(color.slice(5, 7), 16);
    const r2 = parseInt(secondaryColor.slice(1, 3), 16);
    const g2 = parseInt(secondaryColor.slice(3, 5), 16);
    const b2 = parseInt(secondaryColor.slice(5, 7), 16);

    // Pre-compute per-cell
    const dist = new Float32Array(total);
    const jitter = new Float32Array(total);
    const cmix = new Float32Array(total);
    const band = new Uint8Array(total);
    const cellX = new Float32Array(total);
    const cellY = new Float32Array(total);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const px = col * cellPx + cellPx / 2;
        const py = row * cellPx + cellPx / 2;
        cellX[i] = px;
        cellY[i] = py;
        dist[i] = Math.hypot(px - cx, py - cy) / maxDist;
        const s = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
        jitter[i] = (s - Math.floor(s)) * 0.1;
        const s2 = Math.sin(col * 43.7 + row * 89.3) * 23421.631;
        cmix[i] = (s2 - Math.floor(s2));
        band[i] = Math.floor(((s + 1) % 1) * 3) % 3;
      }
    }

    let startTime = 0;
    let rafId = 0;
    let completed = false;
    const halfR = cellPx * dotSize * 0.5;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < total; i++) {
        const d = dist[i];
        const j = jitter[i];
        const col = i % cols;
        const row = (i - col) / cols;

        // Spawn: center → out
        const spawnT = d * 0.6 + j;
        const sp = Math.min(1, Math.max(0, (progress * 2 - spawnT) / 0.2));

        // Despawn: center → out
        const despawnT = d * 0.55 + j;
        const dp = Math.min(1, Math.max(0, (progress * 2 - 1 - despawnT) / 0.2));

        const cellAlpha = dp >= 1 ? 0 : sp <= 0 ? 1 : (1 - dp);

        if (cellAlpha > 0.01) {
          // Black cell background
          ctx.globalAlpha = cellAlpha;
          ctx.fillStyle = "#000";
          ctx.fillRect(col * cellPx, row * cellPx, cellPx + 1, cellPx + 1);
        }

        if (sp <= 0 || dp >= 1) continue;

        // Dot
        const scale = sp < 1
          ? 1 + 2.70158 * (sp - 1) ** 3 + 1.70158 * (sp - 1) ** 2
          : 1;
        const r = halfR * Math.max(0.02, scale * (1 - dp));
        if (r < 0.4) continue;

        const cm = cmix[i];
        const mr = r1 + (r2 - r1) * cm;
        const mg = g1 + (g2 - g1) * cm;
        const mb = b1 + (b2 - b1) * cm;
        const b3 = band[i];
        const bright = 1.0;
        ctx.globalAlpha = Math.min(1, sp) * (1 - dp);
        ctx.fillStyle = `rgb(${Math.round(mr * bright)},${Math.round(mg * bright)},${Math.round(mb * bright)})`;

        const px = cellX[i];
        const py = cellY[i];

        if (b3 === 1) {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, 6.283);
          ctx.fill();
        } else {
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }
      }

      ctx.globalAlpha = 1;

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else if (!completed) {
        completed = true;
        onCompleteRef.current?.();
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [color, secondaryColor, cellSize, dotSize, duration]);

  useEffect(() => {
    const cleanup = draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => {
      cleanup?.();
      window.removeEventListener("resize", handleResize);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
