import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Aurora from '../Aurora/Aurora.jsx';

gsap.registerPlugin(ScrollTrigger);

/* ── Config ── */
const CARD_W = 435;
const CARD_H = 435;
const CARD_R = 40;
const PERSPECTIVE = 1100;
const TILT_INTENSITY = 1.0;
const SPREAD = 1.0;
const SHOW_REFLECTION = true;

const ITEMS = [
  {
    id: 'understand-deeply',
    title: 'Understand Deeply',
    description: 'We start by understanding your brand deeply — its backstory and its challenges. Like Sherlock, who never started with conclusions.',
  },
  {
    id: 'think-collectively',
    title: 'Think Collectively',
    description: 'From there, we look at it through multiple lenses: strategy, creativity, technology, storytelling and experience, to understand what really goes on beneath the brief.',
  },
  {
    id: 'build-cohesively',
    title: 'Build Cohesively',
    description: "Once that's clear, we shape it into stories, systems, and expressions designed for the right platforms and moments across digital, social, film, UX and real-world experiences.",
  },
];

interface Transform {
  x: number; y: number; z: number;
  rotY: number; rotZ: number;
  scale: number; opacity: number; zIndex: number;
  isCenter: boolean; isVisible: boolean;
}

function computeTransform(index: number, currentIndex: number): Transform {
  const offset = index - currentIndex;
  const absOffset = Math.abs(offset);

  const baseSpacing = CARD_W * 1.15 * SPREAD;
  const x = offset * baseSpacing;
  const y = offset * 72;
  const z = -absOffset * 140;
  const rotY = -offset * 26 * TILT_INTENSITY;

  let rotZ = 0;
  if (offset < 0) rotZ = offset * 15 * TILT_INTENSITY;
  else if (offset > 0) rotZ = -offset * 18 * TILT_INTENSITY;

  const scale = Math.max(0.7, 1 - absOffset * 0.15);
  const opacity = Math.max(0, 1 - absOffset * 0.35);
  const zIndex = Math.round(100 - absOffset * 20);

  const isCenter = Math.abs(offset) < 0.35;
  const isVisible = absOffset < 2.5;

  return { x, y, z, rotY, rotZ, scale, opacity, zIndex, isCenter, isVisible };
}

export default function MethodMadness() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentIdxRef = useRef(0);

  const updateCards = (currentIndex: number) => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const t = computeTransform(index, currentIndex);
      card.style.transform =
        `translateX(${t.x}px) translateY(${t.y}px) translateZ(${t.z}px) ` +
        `rotateY(${t.rotY}deg) rotateZ(${t.rotZ}deg) scale(${t.scale})`;
      card.style.opacity = t.isVisible ? String(t.opacity) : '0';
      card.style.zIndex = String(t.zIndex);
      card.style.pointerEvents = t.isVisible ? 'auto' : 'none';
      card.style.visibility = t.isVisible ? 'visible' : 'hidden';

      if (t.isCenter) {
        card.classList.add('is-active');
        if (SHOW_REFLECTION) card.classList.add('has-reflection');
      } else {
        card.classList.remove('is-active', 'has-reflection');
      }
    });
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Init cards at index 0
    updateCards(0);

    const ctx = gsap.context(() => {
      // Pin for (ITEMS.length) viewports of scroll. Progress drives currentIndex.
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: `+=${(ITEMS.length - 1) * 100}%`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = self.progress * (ITEMS.length - 1);
          currentIdxRef.current = idx;
          updateCards(idx);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // Card hover: cursor-tracking sheen
  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const inner = card.querySelector<HTMLDivElement>('.text-card-inner');
    if (!inner) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    inner.style.setProperty('--mouse-x', `${x}px`);
    inner.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={wrapRef}
      className="method-madness relative w-full bg-black overflow-hidden"
      style={{ minHeight: '100vh', padding: '40px 20px' }}
    >
      {/* Aurora background — brand teal/blue, dimmed */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.35 }}>
        <Aurora
          colorStops={['#1D60AB', '#3BA778', '#009F9F']}
          amplitude={0.6}
          blend={0.7}
          speed={0.4}
        />
      </div>
      {/* Ambient glow */}
      <div className="mm-ambient-glow" />

      <div className="w-full h-screen flex flex-col justify-center items-center relative">
        {/* Header */}
        <div className="text-center mb-6 relative z-50 select-none">
          <h1
            className="mm-title"
            style={{
              fontSize: '2.85rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: '#fff',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Method in the{' '}
            <span
              className="mm-title-gradient"
              style={{
                background: 'linear-gradient(90deg, #22c55e 0%, #14b8a6 45%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
              }}
            >
              Madness
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.62)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: 0,
            }}
          >
            Our process is simple
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative w-full flex flex-col items-center justify-center select-none"
          style={{ maxWidth: 1400, minHeight: 520, perspective: `${PERSPECTIVE}px`, padding: '40px 0 60px' }}
        >
          <div
            ref={stageRef}
            className="relative w-full flex items-center justify-center"
            style={{
              height: 530,
              transformStyle: 'preserve-3d',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {ITEMS.map((item, i) => (
              <div
                key={item.id}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="spatial-card absolute"
                onMouseMove={onCardMouseMove}
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: -CARD_H / 2,
                  marginLeft: -CARD_W / 2,
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: CARD_R,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter',
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  transition:
                    'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), ' +
                    'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), ' +
                    'filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  className="text-card-inner"
                  style={{ borderRadius: CARD_R }}
                >
                  <div className="text-card-body">
                    <h3 className="text-card-heading">{item.title}</h3>
                    <p className="text-card-description">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
