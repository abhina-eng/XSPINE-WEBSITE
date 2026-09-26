import { useEffect, useRef } from 'react';

export default function StoryTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    let raf = 0;

    function animate() {
      const rect = wrap!.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollRange = rect.height - vh;
      if (scrollRange <= 0) return;

      if (rect.bottom < 0 || rect.top > vh) {
        text!.style.opacity = '0';
        return;
      }

      const raw = Math.max(0, Math.min(1, -rect.top / scrollRange));

      const easeInOut = (t: number) => t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const textIn = Math.max(0, Math.min(1, (raw - 0.1) / 0.3));
      const textOut = Math.max(0, Math.min(1, (raw - 0.6) / 0.15));
      const eT = easeInOut(textIn) * (1 - easeInOut(textOut));

      text!.style.opacity = `${eT}`;
      text!.style.transform = `translateY(${30 * (1 - easeInOut(textIn))}px)`;
      text!.style.filter = eT < 0.99 ? `blur(${3 * (1 - easeInOut(textIn))}px)` : 'none';
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
    <div ref={wrapRef} style={{ height: '250vh' }} className="relative bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0, padding: '0 clamp(24px, 8vw, 120px)' }}
        >
          <div className="flex flex-col gap-8 pointer-events-auto max-w-[800px] text-center items-center">
            <h2
              className="text-3xl md:text-[56px] font-bold leading-[1.1]"
              style={{
                background: 'linear-gradient(135deg, #3BA778 0%, #2E96FF 60%, #1D60AB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Finding the Story You Already Have
            </h2>
            <div className="flex flex-col gap-0">
              <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed">
                Every brand has a story. Most tell it poorly or don't tell it at all,
                burying it beneath products and campaigns.
              </p>
              <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed mt-2">
                We work with you to uncover that story and translate it into
                communication that's consistent and distinctive.
              </p>
              <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed mt-2">
                Because a story, told well, is what gives a brand its soul.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
