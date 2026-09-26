# XSpine Website

Brand studio site for XSpine. Scroll-driven storytelling with 3D visuals, curtain transitions, and a spatial carousel.

Built with Vite + React 19 + Tailwind 4 + GSAP + three.js + ogl.

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
git clone https://github.com/abhina-eng/XSPINE-WEBSITE.git
cd XSPINE-WEBSITE
npm install
```

## Development

```bash
npm run dev
```

Dev server runs at http://localhost:5173.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Preview production build

```bash
npm run preview
```

## Project structure

```
src/
├── App.jsx                    # Section composition
├── main.jsx                   # React entry
├── index.css                  # Tailwind + fonts + section styles
├── components/
│   ├── ui/hero-01.tsx         # Section 1: Hero
│   ├── DotField/              # Section 2 background particles
│   ├── GridTunnel/            # Section 3: Enter XSPINE transition
│   ├── GridScan/              # WebGL grid effect
│   ├── SlideDeck/             # Sections 4-5-6 pinned deck with curtain-blinds transitions
│   │   └── SlideDeck.tsx      #   Hand-holding heroes → Finding the Story → What we believe / How we get there
│   ├── XSpineFocus/           # Section 7: X + Spine logos with brackets, particles, connector lines
│   ├── MethodMadness/         # Section 8: 3D spatial carousel — Understand / Think / Build
│   ├── Aurora/                # Shared WebGL aurora background for sections 4-8
│   ├── XSpineHero/            # 3D XSpine logo (glTF via three.js)
│   ├── Loader.tsx             # Video + dot-reveal intro loader
│   ├── DotReveal.tsx          # OGL dot-mask reveal
│   └── ...
├── assets/
│   ├── logo/                  # SVG logos
│   ├── clients/               # Client logos
│   └── fonts/                 # Degular Demo family
└── public/
    ├── xspine/                # 3D model + brand images
    └── loader.mp4             # Intro video
```

## Tech stack

- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS 4, tw-animate-css
- **Animation**: GSAP 3 + ScrollTrigger, motion
- **3D / shaders**: three.js, ogl, postprocessing
- **UI primitives**: Radix UI (dialog, label, navigation-menu, slot)
- **Typography**: Degular Demo (local), Plus Jakarta Sans (Google Fonts), Instrument Serif

## Section reference

| # | Section | Component |
|---|---|---|
| 1 | Hero — "Making brands unforgettable" | `ui/hero-01` |
| 2 | Brand question — "Is your brand built to be remembered?" | inline in `App.jsx` |
| 3 | Enter XSPINE (grid-scan tunnel) | `GridTunnel` |
| 4 | Hand-holding heroes (3D X logo) | `SlideDeck` slide 4 |
| 5 | Finding the Story You Already Have | `SlideDeck` slide 5 |
| 6 | What we believe → How we get there (card swap) | `SlideDeck` slide 6 |
| 7 | X is the variable / Spine is the structure | `XSpineFocus` |
| 8 | Method in the Madness — 3D spatial carousel | `MethodMadness` |

## License

Proprietary. All rights reserved.
