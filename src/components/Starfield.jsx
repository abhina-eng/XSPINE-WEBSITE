"use client";

import { useEffect, useRef } from "react";

// Fly-through starfield: stars start far away near a vanishing point and
// rush towards the viewer, growing brighter and faster as they get close.
// The vanishing point eases slightly towards the cursor for parallax.

const CFG = {
  density: 1 / 1800, // stars per CSS px²
  maxStars: 900,
  speed: 0.05, // depth units per second (depth runs 1 → 0)
  focal: 0.9, // projection strength, as a fraction of the larger viewport side
  origin: { x: 0.5, y: 0.32 }, // vanishing point, as a fraction of width/height
  parallax: 40, // px the vanishing point shifts at the viewport edge
  trail: 0, // depth span of each star's streak; 0 for dots only
};

// slight colour variety, weighted towards white
const TINTS = ["#ffffff", "#ffffff", "#ffffff", "#dfe9ff", "#cfe0ff", "#e4fff4"];

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function rand(a, b) {
  return a + Math.random() * (b - a);
}

export default function Starfield({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let focal = 1;
    const stars = [];
    const sprites = new Map();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    // Soft round sprite per tint; drawn scaled, much cheaper than per-star gradients.
    function sprite(tint) {
      if (sprites.has(tint)) return sprites.get(tint);
      const s = 64;
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, tint);
      grad.addColorStop(0.18, tint);
      grad.addColorStop(0.35, hexToRgba(tint, 0.35));
      grad.addColorStop(1, hexToRgba(tint, 0));
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
      sprites.set(tint, c);
      return c;
    }

    // Stars live in a unit-ish 3D box in front of the camera; x/y are spread
    // wide enough that projected stars fill the whole viewport.
    function resetStar(s, z) {
      s.x = rand(-1.2, 1.2) * (w / Math.max(w, h));
      s.y = rand(-1.2, 1.2) * (h / Math.max(w, h));
      s.z = z;
      s.tint = TINTS[(Math.random() * TINTS.length) | 0];
      s.size = rand(0.6, 1.4);
      return s;
    }

    function project(s, z, ox, oy) {
      const k = focal / z;
      return [ox + s.x * k, oy + s.y * k];
    }

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      focal = Math.max(w, h) * CFG.focal;

      const target = Math.min(Math.round(w * h * CFG.density), CFG.maxStars);
      if (stars.length > target) stars.length = target;
      // spread initial depths so the field is full from the first frame
      while (stars.length < target) stars.push(resetStar({}, rand(0.05, 1)));
      if (reduceMotion) draw();
    }

    function update(dt) {
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));

      const ox = w * CFG.origin.x - pointer.x * CFG.parallax;
      const oy = h * CFG.origin.y - pointer.y * CFG.parallax;
      for (const s of stars) {
        s.z -= CFG.speed * dt;
        if (s.z <= 0.02) {
          resetStar(s, rand(0.9, 1));
          continue;
        }
        // recycle stars that have flown out past the edges
        const [px, py] = project(s, s.z, ox, oy);
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) resetStar(s, rand(0.9, 1));
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const ox = w * CFG.origin.x - pointer.x * CFG.parallax;
      const oy = h * CFG.origin.y - pointer.y * CFG.parallax;

      for (const s of stars) {
        const near = 1 - s.z; // 0 far → 1 close
        // fade in from the distance so stars never pop into existence
        const alpha = Math.min(1, near * 3) * (0.35 + near * 0.65);
        const [x, y] = project(s, s.z, ox, oy);
        const r = s.size * (0.4 + near * near * 2.6);

        if (CFG.trail > 0 && !reduceMotion) {
          const [tx, ty] = project(s, Math.min(1, s.z + CFG.trail), ox, oy);
          ctx.globalAlpha = alpha * 0.5;
          ctx.strokeStyle = s.tint;
          ctx.lineWidth = Math.max(0.5, r * 0.6);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        ctx.globalAlpha = alpha;
        const size = r * 6; // sprite core is ~1/3 of its box
        ctx.drawImage(sprite(s.tint), x - size / 2, y - size / 2, size, size);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // ---------- Loop ----------
    let last = performance.now();
    let running = false;
    let rafId = 0;

    function frame(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // ---------- Events ----------
    const onPointerMove = (e) => {
      if (e.pointerType === "touch") return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      pointer.tx = pointer.ty = 0;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // pause when off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    resize();
    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
