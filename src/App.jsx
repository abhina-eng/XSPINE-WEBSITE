import { useEffect } from "react";
import HeroOne from "@/components/ui/hero-01";
import Loader from "@/components/Loader";
import { MagicText } from "@/components/ui/magic-text";
import GridScan from "@/components/GridScan/GridScan";
import GridTunnel from "@/components/GridTunnel/GridTunnel";
import XSpineHero from "@/components/XSpineHero/XSpineHero.jsx";
import GradientHeading from "@/components/GradientHeading";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import StoryTransition from "@/components/StoryTransition/StoryTransition";
import BelieveSection from "@/components/BelieveSection/BelieveSection";
import DotField from "@/components/DotField/DotField";

export default function App() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Loader>
      <div className="bg-black">
        <HeroOne />

        {/* Section 2: Brand question */}
        <section className="relative bg-black text-white py-24 md:py-40 px-4 md:px-[120px]">
          <div className="absolute inset-0 pointer-events-none">
            <DotField
              dotRadius={1.5}
              dotSpacing={14}
              bulgeStrength={67}
              glowRadius={160}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom="#1D60AB"
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, black, transparent)' }} />
          <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, black, transparent)' }} />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <MagicText
                text="Is your brand built to be remembered?"
                className="justify-start text-left"
                variant="heading"
              />
            </div>
            <div>
              <p className="text-base md:text-2xl text-white/50 leading-relaxed">
                Brands today are stuck between two failures. Some stay the same for too long, and start to feel old fashioned. Others change so much that their own audience stops recognizing them.
              </p>
              <p className="text-base md:text-2xl text-white/50 leading-relaxed mt-6">
                Either way, brands end up seen, but never remembered.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: GridScan tunnel → scrolls into Section 4 */}
        <GridTunnel
          title="Enter XSPINE"
          gridContent={
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#2a4a35"
              linesColor2="#1a2d4a"
              gridScale={0.1}
              scanColor="#3BA778"
              scanColor2="#1D60AB"
              scanOpacity={0.5}
              enablePost
              bloomIntensity={1.0}
              chromaticAberration={0.003}
              noiseIntensity={0.01}
              scanGlow={0.8}
              scanSoftness={2.5}
              scanDuration={2.0}
              scanDelay={2.0}
              style={{ width: '100%', height: '100%' }}
            />
          }
        >
          {/* Section 4: text + XSpineHero */}
          <div className="flex flex-col items-center gap-5 pt-[15vh] md:pt-[18vh] px-4 md:px-[4%] shrink-0">
            <ScrollReveal>
              <GradientHeading>Hand-holding heroes</GradientHeading>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="max-w-[630px] text-center text-base md:text-[24px] font-light text-[#8A8A8A] leading-relaxed">
                We're a fluid creative system, bringing together the right minds, disciplines and perspectives at the right time. Our borderless and collaborative model builds around the needs.
              </p>
            </ScrollReveal>
          </div>
          <div className="relative w-full flex-1 min-h-0">
            <XSpineHero />
          </div>
        </GridTunnel>

        {/* Section 4: Story transition — logo shrinks, text slides in */}
        <StoryTransition />

        {/* Section 6: What we believe / How we get there */}
        <BelieveSection />

      </div>
    </Loader>
  );
}
