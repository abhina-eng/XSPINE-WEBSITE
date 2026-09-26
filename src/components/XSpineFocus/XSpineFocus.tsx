import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Aurora from '../Aurora/Aurora.jsx';

gsap.registerPlugin(ScrollTrigger);

const LOGO_X =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjkxIiB2aWV3Qm94PSIwIDAgMTI4IDkxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwLjAwMTMyMzMyTDQ1LjM3MzggMEM1NS43NzE3IDEwLjE4NzIgNjAuNTkxNCAyMi40MTk0IDYzLjY3NDIgMzYuMjM0MkM2Mi43NDI2IDQyLjQzMzcgNjIuNzE2MSA0OC43MzU5IDYzLjU5NTggNTQuOTQyN0M2My4xMTA1IDU2LjQxMjcgNjIuNzQzNiA1OC42ODY0IDYyLjM1NzUgNjAuMjg0OUM1OS40MDI0IDcyLjUyNDQgNTMuNjYyMiA4MS44MDUgNDUuMTMzNyA5MS4wMDExTDAuMDMyMDkyMSA5MS4wMDM4QzE0LjcyNjMgODQuNTcxOSAyOS4xMTA1IDc0Ljg0NTEgMzUuMzU5OCA1OS40MTlDMzkuMDk3NyA1MC4yNTAzIDM5LjAwODcgMzkuOTY1NyAzNS4xMTIgMzAuODYzNUMyOC43MTc0IDE1Ljc1MDkgMTQuNzU3IDUuOTY5MTQgMCAwLjAwMTMyMzMyWiIgZmlsbD0iIzNCQTc3OCIvPgo8cGF0aCBkPSJNODEuOTA5NCAwLjAxNTYyNUwxMjYuNDk5IDAuMDI4NTM1QzExMS40MSA2Ljg5MjA3IDk3LjQ1MjggMTUuNzU4NiA5MS4zMTU3IDMyLjEwNzZDODcuNzMxNiA0MS41MTY2IDg4LjA4NTkgNTEuOTczMiA5Mi4yOTg5IDYxLjExNzhDOTguOTAyMyA3NS42MzUzIDExMi43NyA4NC45NjU5IDEyNy4wMzMgOTAuOTYyMUw4Mi4wNDI0IDkxLjAwMTVDNzEuNzkzOCA4MC43NzE2IDY2LjUzMzMgNjguOTA3MiA2My41OTM4IDU0LjkzNzhDNjIuNzE0IDQ4LjczMSA2Mi43NDA1IDQyLjQyODggNjMuNjcyMiAzNi4yMjkzQzY2LjQ4NyAyMS45ODg1IDcxLjYwNjIgMTAuNTMzOSA4MS45MDk0IDAuMDE1NjI1WiIgZmlsbD0iIzFENjBBQiIvPgo8L3N2Zz4K';
const LOGO_S =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgzIiBoZWlnaHQ9IjE3MCIgdmlld0JveD0iMCAwIDQ4MyAxNzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNTcuNjgyIDM5LjE2NDRDMTg2LjE2NiAzNi4wNDAxIDIwOC42MDggNTcuMjkwNCAyMDguMTYyIDg1LjY5NTdDMjA3LjczNiAxMTMuMDU3IDE4OC4wNzkgMTMxLjU1MSAxNjEuMTQ1IDEzMS4xMzZDMTQ5LjQ1NyAxMzAuOTU2IDE0MC45OTEgMTI4LjA3OSAxMzIuNzI1IDExOS41ODRMMTMyLjcxNyAxNTAuMzY2TDEzMi42ODggMTY5LjM3NUMxMjIuNjc2IDE2OS41ODQgMTExLjgzIDE2OS40MTEgMTAxLjc5MSAxNjkuMzY5QzEwMS4zNDkgMTU1LjY2MyAxMDEuNzU4IDEzOS41ODkgMTAxLjc1OSAxMjUuNzNMMTAxLjc0OCAzOS40MTkzTDEyOC40MzggMzkuMzkzOUMxMjkuMjQxIDQzLjM1NjUgMTMwLjM4NyA0Ny43MzA4IDEzMS4zMzYgNTEuNjk0N0MxMzEuNDU5IDUxLjUzNzYgMTMxLjU4NSA1MS4zODE2IDEzMS43MTMgNTEuMjI3OUMxMzguMzYyIDQzLjIyNTkgMTQ3LjY2MiA0MC4xMDExIDE1Ny42ODIgMzkuMTY0NFpNMTc3LjA3MSA4MC42NzUyQzE3NC42NTggNjguMjU1MiAxNjIuNjU0IDYwLjEzMDQgMTUwLjIzMiA2Mi41MDcyQzEzNy43NTYgNjQuODk0OSAxMjkuNTkxIDc2Ljk2ODYgMTMyLjAxNyA4OS40NDM3QzEzNC40NDIgMTAxLjkxOSAxNDYuNTM2IDExMC4wNSAxNTguOTk3IDEwNy41ODRDMTcxLjQwMiAxMDUuMTI5IDE3OS40ODcgOTMuMDk1MSAxNzcuMDcxIDgwLjY3NTJaIiBmaWxsPSIjMUQ2MEFCIi8+CjxwYXRoIGQ9Ik00MjcuMzg4IDM5LjE2MzFDNDU5LjQxOSAzNi4yNzcyIDQ4Ni43NTggNTcuMTk3MSA0ODEuNTEyIDkxLjc0NTJNNDA3Ljk3MiA5MS43NjU3QzQxMi4xNzUgMTA5LjUyMyA0MzIuNzY3IDExMy4zNzcgNDQ3LjI2MSAxMDQuOTUyQzQ0OS4zNzcgMTAzLjcyMyA0NTAuOTM3IDEwMS41OTIgNDUyLjI1MyA5OS41NjU1TDQ3Ny4zOTMgOTkuNTk1OEM0NzguNDYzIDk5LjU1NSA0ODAuMjA1IDk5LjI5NTUgNDgwLjg1OSAxMDAuMTU4QzQ4MS4wMjIgMTAzLjk3MSA0NzUuNDU2IDExMS45ODggNDczLjEwNyAxMTQuNzA0QzQ1NC41MTMgMTM2LjIxMyA0MTIuNTg0IDEzNS42NzUgMzkyLjEwMSAxMTcuODA0QzM4My43MDkgMTEwLjQ0MiAzNzguNjEgMTAwLjAyOCAzNzcuOTM3IDg4Ljg4MTlDMzc1LjkxNCA1OC44MjkxIDM5OS42OCA0MS4wMzAxIDQyNy4zODggMzkuMTYzMVpNNDUxLjc5MiA3NC41ODdDNDQ4LjA4MyA2Mi45ODc2IDQzOC45MDUgNTkuMzM2NCA0MjcuMzM3IDYwLjc4NjJDNDE4LjM4OSA2Mi4wMTc5IDQxMi41MjMgNjYuMDM3MSA0MDkuMTE0IDc0LjU2NjVMNDMzLjczMyA3NC41NzYyTDQ1MS43OTIgNzQuNTg3WiIgZmlsbD0iIzFENjBBQiIvPgo8cGF0aCBkPSJNMzIzLjgyMyAzOS4xNTY3QzMyNS42OSAzOC44ODIzIDMyOC43OTIgMzguODQ2MyAzMzAuNjk1IDM4LjkzMTNDMzU2Ljc0NCA0MC4wOTY3IDM2NC44MDkgNTcuODQ0NyAzNjQuMjczIDgwLjk4NTVDMzYzLjg4NiA5Ny42MjU4IDM2NC41MDMgMTE0LjUyMiAzNjQuMjA2IDEzMS4wNDRMMzMzLjMzOCAxMzEuMDU5QzMzMy4xMDIgMTE0LjQ1OCAzMzMuNjA4IDk3LjgwMjkgMzMzLjI4NSA4MS4xNTk2QzMzMy4wNDUgNjguOTIyNiAzMjguMjQ2IDYyLjI3ODUgMzE1LjM1NSA2My4xNDExQzMwOS40OTkgNjMuNTMyOSAzMDYuMzAzIDY0LjY2NzMgMzAyLjI4IDY5LjA2OEMyOTYuOTg4IDc2LjQ2MyAyOTguMjkxIDg3Ljk3NDEgMjk4LjI5NSA5Ni44ODI5TDI5OC4yODEgMTMxLjA1N0wyNjcuNiAxMzEuMDQ3QzI2Ny4zOSAxMjguMzU3IDI2Ny41MyAxMjMuNyAyNjcuNTMgMTIwLjg5TDI2Ny41NDMgMTAxLjUyMUwyNjcuNTE3IDM5LjQwNDFMMjk0LjAyNSAzOS4zODc1TDI5Ni45ODUgNTEuODcyNUMyOTcuMTA1IDUxLjcxMjQgMjk3LjIyNSA1MS41NTUgMjk3LjM1MSA1MS40MDAzQzMwMy43NjQgNDMuNTMxNSAzMTQuMDM1IDQwLjEwOSAzMjMuODIzIDM5LjE1NjdaIiBmaWxsPSIjMUQ2MEFCIi8+CjxwYXRoIGQ9Ik0zOC42MjEgMzkuMTU2N0M1OS43MDAyIDM3LjM2MDEgODMuNjE5OSA0My4zMDkgODYuNjQwMyA2Ny45MjM5Qzc3LjAzNjEgNjguMTIwMyA2Ni43MjA5IDY3Ljk0OTMgNTcuMDYzIDY3Ljk2MDNDNTUuMzI1NyA2MC41MTg2IDQ5LjgwNiA1OS4xMTExIDQyLjgzMTkgNTkuMDA3NEMzOC44NDAzIDU4Ljc4NiAyOS45Mjk5IDYwLjcwNDMgMzAuMDczNiA2Ni4wMzMzQzMwLjIzNTUgNzIuMDQ1MiA0NC4xNjE3IDczLjI3MzYgNDguMjg5OSA3My44OTUyQzY0LjM1NDcgNzYuMzE0NiA4Ny42NDk1IDc5LjczMjQgODguMDUxNyAxMDAuNzYzQzg4LjE4NzEgMTA3LjQ4MiA4NS42MDc1IDExMy45NzIgODAuODk3NyAxMTguNzYzQzcyLjMzMDkgMTI3LjU5NiA1OC45NzMgMTMwLjg5MyA0Ny4wMjA1IDEzMS4xMDNDMjUuNjIwNCAxMzEuNTQ3IDIuNDUwODkgMTI1LjYzNyAwIDEwMC4zNzJMMjkuNDggMTAwLjM1N0MzMS41NDI2IDExMC4wNDYgMzguNDQ2NCAxMTEgNDcuMzI5OCAxMTAuODFDNTEuNjg2MyAxMTAuNzE3IDU5LjQ0MTIgMTA3LjU4MyA1OC43MTcgMTAyLjM1N0M1Ny44OTg5IDk2LjQ1MzQgNDMuNjAzNCA5NS42ODI4IDM4Ljk1NjkgOTQuNjE3NUMyNy45ODUzIDkyLjY4MzYgMTYuNzg3MyA5MS4yMjA3IDcuODg0OTEgODQuMDMzNEMtMS45Mzk5OCA3Ni4xMDE2IC0xLjgwNTY3IDYxLjM5MTIgNi4xOTY1NSA1Mi4yOTU5QzE0LjM2ODQgNDMuMDE1MyAyNi43OTc1IDQwLjAxMyAzOC42MjEgMzkuMTU2N1oiIGZpbGw9IiMxRDYwQUIiLz4KPHBhdGggZD0iTTIyMi40NjYgMzkuNDI0N0wyNTMuMzc0IDM5LjQxNDFMMjUzLjMzIDEzMS4wMzhDMjQzLjE4OSAxMzEuMTc2IDIzMi43MDcgMTMxLjA0NSAyMjIuNTM5IDEzMS4wNDdDMjIyLjMwOSAxMjguMDEyIDIyMi40MzkgMTIzLjQ1OSAyMjIuNDM2IDEyMC4zMjlMMjIyLjQzOSAxMDAuNDk3TDIyMi40NjYgMzkuNDI0N1oiIGZpbGw9IiMxRDYwQUIiLz4KPHBhdGggZD0iTTIzNC4yNDQgMC4zMzMzMzdDMjQyLjg3OSAtMS40NDg5IDI1MS4zMzQgNC4wOTI1NCAyNTMuMTQ3IDEyLjcyNzZDMjU0Ljk2NCAyMS4zNjI4IDI0OS40NTUgMjkuODQwNSAyNDAuODMzIDMxLjY4OTRDMjMyLjE2MSAzMy41NDg3IDIyMy42MzMgMjguMDAzMiAyMjEuODA2IDE5LjMyMDRDMjE5Ljk4MyAxMC42MzggMjI1LjU1OSAyLjEyNTI1IDIzNC4yNDQgMC4zMzMzMzdaIiBmaWxsPSIjMUQ2MEFCIi8+Cjwvc3ZnPgo=';

export default function XSpineFocus() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const logoXRef = useRef<HTMLImageElement>(null);
  const logoSRef = useRef<HTMLImageElement>(null);
  const txRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      // PHASE 1: logos fade in (0 → 20%)
      const p1 = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: '20% top', scrub: 1 },
      });
      p1.to([logoXRef.current, logoSRef.current], { opacity: 1, duration: 1 }, 0);

      // PHASE 2: focus X (25 → 50%)
      const p2 = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: '25% top', end: '50% top', scrub: 1 },
      });
      p2.to(logoSRef.current, { filter: 'blur(5px)', opacity: 0.35, duration: 1 }, 0)
        .to(txRef.current, { opacity: 1, duration: 1 }, 0.2);

      // PHASE 3: focus Spine (55 → 82%)
      const p3 = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: '55% top', end: '82% top', scrub: 1 },
      });
      p3.to(logoSRef.current, { filter: 'blur(0px)', opacity: 1, duration: 1 }, 0)
        .to(logoXRef.current, { filter: 'blur(5px)', opacity: 0.35, duration: 1 }, 0)
        .to(txRef.current, { opacity: 0.15, duration: 0.8 }, 0)
        .to(tsRef.current, { opacity: 1, duration: 1 }, 0.2);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative bg-black" style={{ height: '500vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.35 }}>
          <Aurora
            colorStops={['#1D60AB', '#3BA778', '#009F9F']}
            amplitude={0.6}
            blend={0.7}
            speed={0.4}
          />
        </div>

        {/* Logos */}
        <img
          ref={logoXRef}
          src={LOGO_X}
          alt="X"
          className="absolute pointer-events-none"
          style={{ left: '32.46%', top: '43.35%', width: '6.65%', opacity: 0, zIndex: 10 }}
        />
        <img
          ref={logoSRef}
          src={LOGO_S}
          alt="Spine"
          className="absolute pointer-events-none"
          style={{ left: '44.65%', top: '43.21%', width: '25.2%', opacity: 0, zIndex: 10 }}
        />

        {/* X text (top-left) */}
        <div
          ref={txRef}
          className="absolute"
          style={{ left: '10.56%', top: '6.55%', width: '19.3%', opacity: 0, zIndex: 10 }}
        >
          <h2 style={{ fontSize: 'clamp(22px, 2.9vw, 56px)', fontWeight: 600, lineHeight: 1, marginBottom: '0.7em', color: '#FFFFFF' }}>
            X is the<br />variable.
          </h2>
          <p style={{ fontSize: 'clamp(12px, 1.04vw, 20px)', fontWeight: 300, lineHeight: 1.5, color: '#D9D9D9' }}>
            X is the variable. The unknown. The change every brand must navigate
          </p>
        </div>

        {/* Spine text (bottom-right) */}
        <div
          ref={tsRef}
          className="absolute"
          style={{ left: '61.6%', top: '73.1%', width: '22.7%', opacity: 0, zIndex: 10 }}
        >
          <h2 style={{ fontSize: 'clamp(22px, 3.3vw, 64px)', fontWeight: 600, lineHeight: 0.86, marginBottom: '0.5em', color: '#FFFFFF' }}>
            Spine is the<br />structure
          </h2>
          <p style={{ fontSize: 'clamp(12px, 1.04vw, 20px)', fontWeight: 400, lineHeight: 1.5, color: '#D9D9D9' }}>
            The identity that keeps a brand grounded through that change. Together, they hold the balance every modern brand needs; agile enough to evolve, honest enough to stay true.
          </p>
        </div>
      </div>
    </div>
  );
}
