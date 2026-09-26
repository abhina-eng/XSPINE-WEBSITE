import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import XSpineHero from '../XSpineHero/XSpineHero.jsx';
import GradientHeading from '../GradientHeading';
import Aurora from '../Aurora/Aurora.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ── Prototype tokens ── */
const SQ = 14;
const CARD_H = 170;
const SQ_OFFSET = 18;
const ACCENT = '#5ECFB0';
const BLIND_COUNT = 8;

const slides6 = [
  {
    title: 'What we believe',
    body: 'We believe the most powerful thing a brand can do is sound like itself. A brand isn’t remembered for how loudly it speaks, but for how unmistakably it sounds.',
  },
  {
    title: 'How we get there',
    body: 'We uncover the story at the heart of your brand, and help you tell it, consistently, distinctively and everywhere it counts.',
  },
];

// Card — root sized to FRAME only (no baked corner squares). Body absolute below so yPercent:-50 aligns frame center.
function ProtoCard({ title, body, refFn }: { title: string; body: string; refFn: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={refFn}
      className="absolute"
      style={{ width: 'min(340px, 80vw)', height: CARD_H }}
    >
      {/* Border lines */}
      <div className="absolute" style={{ top: 0, left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.15)' }} />
      <div className="absolute" style={{ bottom: 0, left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.15)' }} />
      <div className="absolute" style={{ top: 0, left: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.15)' }} />
      <div className="absolute" style={{ top: 0, right: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.15)' }} />
      {/* Title centered in frame */}
      <div
        className="absolute inset-0 flex items-center justify-center text-white text-center"
        style={{
          fontSize: 'clamp(20px, 4vw, 26px)',
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
      {/* Body absolute below frame */}
      <div className="absolute" style={{ top: CARD_H + 24, left: 0, width: '100%' }}>
        <p style={{ fontSize: 'clamp(13px, 2.5vw, 15px)', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function SlideDeck() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const slide4Ref = useRef<HTMLDivElement>(null);
  const slide5Ref = useRef<HTMLDivElement>(null);
  const slide6Ref = useRef<HTMLDivElement>(null);

  const blindsAref = useRef<(HTMLDivElement | null)[]>([]);
  const blindsBref = useRef<(HTMLDivElement | null)[]>([]);

  // Section 6 refs
  const isTLRef = useRef<HTMLDivElement>(null);
  const isTRRef = useRef<HTMLDivElement>(null);
  const isBLRef = useRef<HTMLDivElement>(null);
  const isBRRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const progBarRef = useRef<HTMLDivElement>(null);
  const tab1Ref = useRef<HTMLDivElement>(null);
  const tab2Ref = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Card 1 centered, hidden initially. Card 2 off-screen right.
    gsap.set(card1Ref.current, {
      xPercent: -50, yPercent: -50,
      top: '46%', left: '50%',
      opacity: 0,
    });
    gsap.set(card2Ref.current, {
      xPercent: -50, yPercent: -50,
      top: '46%', left: '150%',
      opacity: 1,
    });

    const ctx = gsap.context(() => {
      // Spin all init squares individually with stagger
      const spinAnim = gsap.to(
        [isTLRef.current, isTRRef.current, isBLRef.current, isBRRef.current],
        { rotation: 360, duration: 2.5, ease: 'none', repeat: -1, stagger: 0.04 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=800%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Curtain A close (4 → 5)
      blindsAref.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.06, ease: 'power2.in' }, 0.12 + i * 0.008);
      });
      tl.set(slide4Ref.current, { opacity: 0 }, 0.19);
      tl.set(slide5Ref.current, { opacity: 1 }, 0.19);
      blindsAref.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { scaleY: 0, duration: 0.06, ease: 'power2.out' }, 0.20 + i * 0.008);
      });

      // Curtain B close (5 → 6)
      blindsBref.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.06, ease: 'power2.in' }, 0.40 + i * 0.008);
      });
      tl.set(slide5Ref.current, { opacity: 0 }, 0.47);
      tl.set(slide6Ref.current, { opacity: 1 }, 0.47);
      blindsBref.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { scaleY: 0, duration: 0.06, ease: 'power2.out' }, 0.48 + i * 0.008);
      });

      // ═════ SECTION 6 (prototype) ═════
      // PHASE 1: init squares expand outward to EXACT card corner square positions
      // Card 340×170, corner squares at -18px offset (14×14). Corner square centers:
      //   TL: (-170-11, -85-11) = (-181, -96) from card center
      // Init square centers start at (±9, ±9) inside 32×32 cluster.
      // Translate delta = target - start:
      //   TL: x=-172, y=-87  TR: x=172, y=-87  BL: x=-172, y=87  BR: x=172, y=87
      tl.to([isTLRef.current, isTRRef.current, isBLRef.current, isBRRef.current],
        { rotation: 0, duration: 0.03 }, 0.55);
      tl.to(isTLRef.current, { x: -172, y: -87, duration: 0.14, ease: 'power2.inOut' }, 0.56);
      tl.to(isTRRef.current, { x:  172, y: -87, duration: 0.14, ease: 'power2.inOut' }, 0.56);
      tl.to(isBLRef.current, { x: -172, y:  87, duration: 0.14, ease: 'power2.inOut' }, 0.56);
      tl.to(isBRRef.current, { x:  172, y:  87, duration: 0.14, ease: 'power2.inOut' }, 0.56);
      // Init squares STAY at card corners — no fade out
      tl.to(card1Ref.current, { opacity: 1, duration: 0.06 }, 0.65);
      tl.to(progBarRef.current, { opacity: 1, duration: 0.04 }, 0.72);

      // Kill spinner
      ScrollTrigger.create({
        trigger: section,
        start: () => `top+=${window.innerHeight * 8 * 0.55} top`,
        onEnter: () => spinAnim.kill(),
        onLeaveBack: () => {
          gsap.set([isTLRef.current, isTRRef.current, isBLRef.current, isBRRef.current],
            { x: 0, y: 0, opacity: 1 });
          spinAnim.restart();
        },
      });

      // PHASE 2: card 1 shrinks + drifts left + blurs + fades; card 2 slides in from right
      tl.to(card1Ref.current, {
        scale: 0.55,
        left: '15%',
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.16, ease: 'power2.inOut',
      }, 0.78);
      tl.to(card2Ref.current, {
        left: '50%',
        duration: 0.16, ease: 'power2.inOut',
      }, 0.80);

      // Progress fill + tab swap
      tl.to(progFillRef.current, { width: '100%', duration: 0.16, ease: 'none' }, 0.78);
      tl.to(tab1Ref.current, { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', duration: 0.06 }, 0.86);
      tl.to(tab2Ref.current, { backgroundColor: ACCENT, color: '#0a0a0a', duration: 0.06 }, 0.86);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black w-full" style={{ height: '100vh' }}>
      {/* Aurora background — brand teal/blue, dimmed */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.35 }}>
        <Aurora
          colorStops={['#1D60AB', '#3BA778', '#009F9F']}
          amplitude={0.6}
          blend={0.7}
          speed={0.4}
        />
      </div>

      {/* ═════ SLIDE 4 ═════ */}
      <div ref={slide4Ref} className="absolute inset-0 flex flex-col" style={{ zIndex: 10, opacity: 1 }}>
        <div className="flex flex-col items-center gap-5 pt-[10vh] px-4 md:px-[4%] shrink-0">
          <GradientHeading>Hand-holding heroes</GradientHeading>
          <p className="max-w-[630px] text-center text-base md:text-[24px] font-light text-[#8A8A8A] leading-relaxed">
            We&rsquo;re a fluid creative system, bringing together the right minds, disciplines and perspectives at the right time. Our borderless and collaborative model builds around the needs.
          </p>
        </div>
        <div className="relative w-full flex-1 min-h-0">
          <XSpineHero />
        </div>
      </div>

      {/* ═════ SLIDE 5 ═════ */}
      <div ref={slide5Ref} className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10, opacity: 0, padding: '0 clamp(24px, 8vw, 120px)' }}>
        <div className="flex flex-col gap-8 max-w-[800px] text-center items-center">
          <h2
            className="text-3xl md:text-[56px] font-bold leading-[1.1]"
            style={{
              background: 'linear-gradient(135deg, #3BA778 0%, #2E96FF 60%, #1D60AB 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Finding the Story You Already Have
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed">
              Every brand has a story. Most tell it poorly or don&rsquo;t tell it at all, burying it beneath products and campaigns.
            </p>
            <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed">
              We work with you to uncover that story and translate it into communication that&rsquo;s consistent and distinctive.
            </p>
            <p className="text-sm md:text-[20px] font-light text-[#8A8A8A] leading-relaxed">
              Because a story, told well, is what gives a brand its soul.
            </p>
          </div>
        </div>
      </div>

      {/* ═════ SLIDE 6 — prototype ═════ */}
      <div ref={slide6Ref} className="absolute inset-0" style={{ zIndex: 10, opacity: 0 }}>
        {/* Init 4 squares (32×32 cluster, individual spin). Aligned to card 1 center (top:46%) */}
        <div
          className="absolute"
          style={{
            top: '46%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 32, height: 32, zIndex: 20,
          }}
        >
          <div ref={isTLRef} className="absolute" style={{ top: 0, left: 0, width: SQ, height: SQ, borderRadius: 2, background: `linear-gradient(135deg, ${ACCENT}, #3BA68A)` }} />
          <div ref={isTRRef} className="absolute" style={{ top: 0, right: 0, width: SQ, height: SQ, borderRadius: 2, background: `linear-gradient(225deg, ${ACCENT}, #3BA68A)` }} />
          <div ref={isBLRef} className="absolute" style={{ bottom: 0, left: 0, width: SQ, height: SQ, borderRadius: 2, background: `linear-gradient(45deg, ${ACCENT}, #3BA68A)` }} />
          <div ref={isBRRef} className="absolute" style={{ bottom: 0, right: 0, width: SQ, height: SQ, borderRadius: 2, background: `linear-gradient(315deg, ${ACCENT}, #3BA68A)` }} />
        </div>

        <ProtoCard title={slides6[0].title} body={slides6[0].body} refFn={(el) => { card1Ref.current = el; }} />
        <ProtoCard title={slides6[1].title} body={slides6[1].body} refFn={(el) => { card2Ref.current = el; }} />

        {/* Progress bar */}
        <div
          ref={progBarRef}
          className="absolute flex items-center"
          style={{ bottom: 48, left: '50%', transform: 'translateX(-50%)', width: 'min(440px, 85vw)', opacity: 0, zIndex: 25 }}
        >
          <div
            ref={tab1Ref}
            className="flex items-center justify-center shrink-0"
            style={{ width: 44, height: 32, fontSize: 13, fontWeight: 500, borderRadius: 4, backgroundColor: ACCENT, color: '#0a0a0a' }}
          >
            1
          </div>
          <div className="flex-1 relative" style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div
              ref={progFillRef}
              className="absolute top-0 left-0 h-full"
              style={{ width: '0%', backgroundColor: ACCENT }}
            />
          </div>
          <div
            ref={tab2Ref}
            className="flex items-center justify-center shrink-0"
            style={{ width: 44, height: 32, fontSize: 13, fontWeight: 500, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
          >
            2
          </div>
        </div>
      </div>

      {/* ═════ CURTAIN A: 4 → 5 ═════ */}
      <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 50 }}>
        {Array.from({ length: BLIND_COUNT }).map((_, i) => (
          <div
            key={`ca-${i}`}
            ref={(el) => { blindsAref.current[i] = el; }}
            className="flex-1 h-full"
            style={{
              background: 'linear-gradient(180deg, #3BA778 0%, #2E96FF 50%, #1D60AB 100%)',
              transform: 'scaleY(0)', transformOrigin: 'top', willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ═════ CURTAIN B: 5 → 6 ═════ */}
      <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 51 }}>
        {Array.from({ length: BLIND_COUNT }).map((_, i) => (
          <div
            key={`cb-${i}`}
            ref={(el) => { blindsBref.current[i] = el; }}
            className="flex-1 h-full"
            style={{
              background: 'linear-gradient(180deg, #3BA778 0%, #009F9F 50%, #1D60AB 100%)',
              transform: 'scaleY(0)', transformOrigin: 'bottom', willChange: 'transform',
            }}
          />
        ))}
      </div>
    </section>
  );
}
