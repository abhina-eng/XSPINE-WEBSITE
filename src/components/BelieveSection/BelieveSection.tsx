import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Figma-exact tokens ── */
const SQ = 18;                       // gradient square size
const CARD_W = 395;                  // card width
const CARD_H = 210;                  // card height
const BORDER_COLOR = '#313131';      // card border
const BORDER_W = 3;                  // card border width
const BODY_GAP = 44;                 // gap card → body text
const BTN_GREEN = '#3BA778';
const BTN_GRAY = '#333';
const SQ_CLUSTER_GAP = 12;          // gap between squares in cluster state

const slides = [
  {
    title: 'What we believe',
    body: [
      'We believe the most powerful thing a brand can do is sound like itself.',
      'A brand isn’t remembered for how loudly it speaks, but for how unmistakably it sounds.',
    ],
  },
  {
    title: 'How we get there',
    body: [
      'We uncover the story at the heart of your brand, and help you tell it, consistently, distinctively and everywhere it counts.',
    ],
  },
];

export default function BelieveSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const squareGroupRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardBorderRef = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLDivElement>(null);
  const btn2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const halfW = CARD_W / 2;
    const halfH = CARD_H / 2;

    // Corner positions: square sits outside card corner
    const corners = [
      { x: -(halfW + SQ / 2), y: -(halfH + SQ / 2) }, // TL
      { x: halfW - SQ / 2,    y: -(halfH + SQ / 2) }, // TR
      { x: -(halfW + SQ / 2), y: halfH - SQ / 2 },    // BL
      { x: halfW - SQ / 2,    y: halfH - SQ / 2 },    // BR
    ];

    const ctx = gsap.context(() => {
      // Continuous slow rotation on square group (killed when expansion begins)
      const rotTween = gsap.to(squareGroupRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: 'none',
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Kill rotation once expansion begins; restore when scrolled back to start
            if (self.progress > 0.03) {
              if (rotTween.isActive()) {
                rotTween.pause();
                gsap.to(squareGroupRef.current, { rotation: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
              }
            } else {
              if (!rotTween.isActive()) {
                gsap.set(squareGroupRef.current, { rotation: 0 });
                rotTween.restart();
              }
            }
          },
        },
      });

      // ── Phase 1 (0 → 0.25): Squares expand ──
      squaresRef.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, {
          x: corners[i].x,
          y: corners[i].y,
          duration: 0.25,
          ease: 'power3.out',
        }, 0);
      });

      // ── Phase 1b (0.15 → 0.35): Border + card 1 + pagination + peek ──
      tl.to(cardBorderRef.current, { opacity: 1, duration: 0.12, ease: 'power1.in' }, 0.15);
      tl.to(slide1Ref.current, { opacity: 1, duration: 0.15, ease: 'power1.in' }, 0.20);
      tl.to(paginationRef.current, { opacity: 1, duration: 0.10 }, 0.25);
      tl.to(peekRef.current, { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' }, 0.25);

      // ── Phase 2 (0.50 → 0.85): Slide to card 2 ──
      tl.to(slide1Ref.current, {
        x: -(CARD_W + 500), opacity: 0,
        duration: 0.30, ease: 'power2.inOut',
      }, 0.50);
      tl.to(peekRef.current, { opacity: 0, duration: 0.08 }, 0.50);

      tl.fromTo(slide2Ref.current,
        { x: CARD_W + 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.30, ease: 'power2.inOut' },
        0.55,
      );

      // Pagination: button 2 slides from right edge to sit next to button 1
      const pagEl = paginationRef.current;
      if (pagEl && btn2Ref.current) {
        const pagW = pagEl.offsetWidth;
        // btn sizes from Figma: px-40 py-8 → roughly 80+textW. Using actual element widths
        const btn1W = btn1Ref.current?.offsetWidth || 80;
        const btn2W = btn2Ref.current?.offsetWidth || 80;
        const dist = pagW - btn1W - btn2W - 16; // 16px gap in final state
        tl.to(btn2Ref.current, {
          x: -dist,
          duration: 0.35,
          ease: 'power2.inOut',
        }, 0.50);
      }

      // Swap button colors
      tl.to(btn1Ref.current, { backgroundColor: BTN_GRAY, duration: 0.20 }, 0.55);
      tl.to(btn2Ref.current, { backgroundColor: BTN_GREEN, duration: 0.20 }, 0.60);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black w-full"
      style={{ height: '100vh' }}
    >
      {/* Center stage — offset up to leave room for body text below card */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ marginTop: '-100px' }}>

        {/* ── 4 gradient squares ── */}
        <div ref={squareGroupRef} className="absolute" style={{ zIndex: 30 }}>
          {[0, 1, 2, 3].map((i) => {
            const col = i % 2 === 0 ? -1 : 1;
            const row = i < 2 ? -1 : 1;
            const ix = col * (SQ_CLUSTER_GAP / 2) - SQ / 2;
            const iy = row * (SQ_CLUSTER_GAP / 2) - SQ / 2;
            return (
              <div
                key={i}
                ref={(el) => { squaresRef.current[i] = el; }}
                className="absolute"
                style={{
                  width: SQ,
                  height: SQ,
                  background: 'linear-gradient(to bottom, #3BA778, #009F9F)',
                  transform: `translate(${ix}px, ${iy}px)`,
                  willChange: 'transform',
                }}
              />
            );
          })}
        </div>

        {/* ── Card border ── */}
        <div
          ref={cardBorderRef}
          className="absolute pointer-events-none"
          style={{
            width: CARD_W,
            height: CARD_H,
            border: `${BORDER_W}px solid ${BORDER_COLOR}`,
            opacity: 0,
            zIndex: 10,
          }}
        />

        {/* ── Slide 1: "What we believe" ── */}
        <div
          ref={slide1Ref}
          className="absolute"
          style={{ width: CARD_W, height: CARD_H, opacity: 0, zIndex: 15 }}
        >
          {/* Title centered in card area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3
              className="text-white text-[32px] md:text-[40px] font-semibold text-center"
              style={{ fontFamily: "'Degular Demo', sans-serif", lineHeight: '36px' }}
            >
              {slides[0].title}
            </h3>
          </div>
          {/* Body below card */}
          <div className="absolute left-0 right-0" style={{ top: CARD_H + BODY_GAP }}>
            {slides[0].body.map((line, li) => (
              <p
                key={li}
                className="text-[18px] md:text-[24px] leading-normal"
                style={{ color: '#8A8A8A', fontFamily: "'Degular Demo', sans-serif", fontWeight: 400 }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ── Slide 2: "How we get there" ── */}
        <div
          ref={slide2Ref}
          className="absolute"
          style={{ width: CARD_W, height: CARD_H, opacity: 0, zIndex: 15 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h3
              className="text-white text-[32px] md:text-[40px] font-semibold text-center"
              style={{ fontFamily: "'Degular Demo', sans-serif", lineHeight: '36px' }}
            >
              {slides[1].title}
            </h3>
          </div>
          <div className="absolute left-0 right-0" style={{ top: CARD_H + BODY_GAP }}>
            {slides[1].body.map((line, li) => (
              <p
                key={li}
                className="text-[18px] md:text-[24px] leading-normal"
                style={{ color: '#8A8A8A', fontFamily: "'Degular Demo', sans-serif", fontWeight: 400 }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ── Peek card: blurred "How we get there" on right ── */}
        <div
          ref={peekRef}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: `calc(50% + ${CARD_W / 2}px + 80px)`,
            width: CARD_W,
            height: CARD_H,
            border: `${BORDER_W}px solid ${BORDER_COLOR}`,
            filter: 'blur(4px)',
            opacity: 0,
            transform: 'translateX(40px)',
            zIndex: 5,
          }}
        >
          <h3
            className="text-[32px] md:text-[40px] font-semibold"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Degular Demo', sans-serif" }}
          >
            How we get there
          </h3>
        </div>
      </div>

      {/* ── Pagination bar ── */}
      <div
        ref={paginationRef}
        className="absolute left-0 right-0 flex flex-col"
        style={{ bottom: 80, opacity: 0, zIndex: 40, padding: '0 calc(50% - 540px)' }}
      >
        {/* Teal line */}
        <div style={{ height: 1, backgroundColor: BTN_GREEN, marginBottom: -1 }} />

        {/* Buttons */}
        <div className="relative flex items-center justify-between" style={{ marginTop: 8 }}>
          <div
            ref={btn1Ref}
            className="flex items-center justify-center text-white font-semibold shrink-0 relative z-10"
            style={{
              padding: '8px 40px',
              backgroundColor: BTN_GREEN,
              fontSize: 24,
              fontFamily: "'Degular Demo', sans-serif",
            }}
          >
            1
          </div>
          <div
            ref={btn2Ref}
            className="flex items-center justify-center text-white font-semibold shrink-0 relative z-10"
            style={{
              padding: '8px 40px',
              backgroundColor: BTN_GRAY,
              fontSize: 24,
              fontFamily: "'Degular Demo', sans-serif",
            }}
          >
            2
          </div>
        </div>
      </div>
    </section>
  );
}
