import { useEffect, useRef, type ReactNode } from 'react';

interface GridTunnelProps {
  title?: string;
  children?: ReactNode;
  gridContent?: ReactNode;
}

export default function GridTunnel({ title = 'Enter XSPINE', children, gridContent }: GridTunnelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const titleEl = titleRef.current;
    const content = contentRef.current;
    const grid = gridRef.current;
    if (!wrap || !titleEl || !content || !grid) return;

    let raf = 0;

    const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function animate() {
      const rect = wrap!.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollRange = rect.height - vh;
      if (scrollRange <= 0) return;

      const raw = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Phase 1 (0–0.3): title visible, grid full
      // Phase 2 (0.3–0.5): title fades out
      // Phase 3 (0.5–0.7): grid fades, content fades in
      // Phase 4 (0.7–1): content fully visible

      const titleFade = 1 - ease(Math.max(0, Math.min(1, (raw - 0.2) / 0.15)));
      titleEl!.style.opacity = `${titleFade}`;
      titleEl!.style.transform = `translate(-50%, -50%) scale(${1 + 0.1 * (1 - titleFade)})`;

      const gridFade = 1 - ease(Math.max(0, Math.min(1, (raw - 0.45) / 0.2)));
      grid!.style.opacity = `${gridFade}`;

      const contentIn = ease(Math.max(0, Math.min(1, (raw - 0.5) / 0.2)));
      content!.style.opacity = `${contentIn}`;
      content!.style.transform = `translateY(${40 * (1 - contentIn)}px)`;
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    animate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ height: '400vh' }} className="relative bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* GridScan background */}
        <div ref={gridRef} className="absolute inset-0" style={{ zIndex: 1 }}>
          {gridContent}
        </div>

        {/* Title overlay */}
        <div
          ref={titleRef}
          className="absolute left-1/2 top-1/2 z-10 pointer-events-none"
          style={{
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <h2
            className="text-4xl md:text-[72px] font-bold text-white"
            style={{ textShadow: '0 0 60px rgba(0,0,0,0.8)' }}
          >
            {title}
          </h2>
        </div>

        {/* Section 4 content */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center"
          style={{ zIndex: 5, opacity: 0 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
