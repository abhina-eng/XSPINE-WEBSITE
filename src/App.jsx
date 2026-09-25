import { useEffect } from "react";
import HeroOne from "@/components/ui/hero-01";
import Loader from "@/components/Loader";
import { MagicText } from "@/components/ui/magic-text";
import ScrollExpand from "@/components/ScrollExpand/ScrollExpand";
import GridScan from "@/components/GridScan/GridScan";
import XSpineHero from "@/components/XSpineHero/XSpineHero.jsx";
import FloatingPaths from "@/components/FloatingPaths/FloatingPaths";
import GradientHeading from "@/components/GradientHeading";

export default function App() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Loader>
      <div className="bg-black">
        <HeroOne />

        {/* Section 2: Brand question */}
        <section className="relative bg-black text-white py-24 md:py-40 px-4 md:px-[120px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
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

        {/* Section 3: ScrollExpand → GridScan → Section 4 reveal */}
        <ScrollExpand
          title="Enter XSPINE"
          scrollHint="Scroll"
          startWidth={42}
          startHeight={58}
          startRadius={24}
          endRadius={0}
          mediaZoom={1.15}
          scrollDistance={1.2}
          holdDistance={0.5}
          smoothing={0.1}
          overlayScrim={0.4}
          useWindowScroll
          mediaContent={
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#2a4a35"
              gridScale={0.1}
              scanColor="#3BA778"
              scanOpacity={0.5}
              enablePost
              bloomIntensity={0.6}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
              scanGlow={0.5}
              scanSoftness={2}
              scanDuration={2.0}
              scanDelay={2.0}
              style={{ width: '100%', height: '100%' }}
            />
          }
        >
          {/* Section 4: text + XSpineHero in same viewport */}
          <div className="flex flex-col items-center w-full h-full">
            <div className="flex flex-col items-center gap-4 pt-6 md:pt-10 px-4 md:px-[4%] shrink-0">
              <GradientHeading>Hand-holding heroes</GradientHeading>
              <p className="max-w-[630px] text-center text-base md:text-[24px] font-light text-[#8A8A8A] leading-relaxed">
                We're a fluid creative system, bringing together the right minds,
                <br />
                disciplines and perspectives at the right time.
                <br />
                Our borderless and collaborative model builds around the needs
              </p>
            </div>
            <div className="relative w-full flex-1 min-h-0">
              <FloatingPaths />
              <XSpineHero />
            </div>
          </div>
        </ScrollExpand>
      </div>
    </Loader>
  );
}
