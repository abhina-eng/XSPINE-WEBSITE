import type * as React from "react";
import HeroSection from "@/components/ui/hero-01-utils/hero";
import type { NavigationSection } from "@/components/ui/hero-01-utils/header";
import Header from "@/components/ui/hero-01-utils/header";
import BrandSlider, {
  type BrandList,
} from "@/components/ui/hero-01-utils/brand-slider";
import HeroBackdrop from "@/components/ui/hero-01-utils/backdrop";
import SplashCursor from "@/components/SplashCursor";

// Client logos, shown in file order (client-1 … client-9)
const clientLogos = Object.entries(
  import.meta.glob<string>("@/assets/clients/*.svg", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

export default function AgencyHeroSection() {
  const navigationData: NavigationSection[] = [
    {
      title: "Home",
      href: "#",
      isActive: true,
    },
    {
      title: "About us",
      href: "#",
    },
    {
      title: "Services",
      href: "#",
    },
    {
      title: "Team",
      href: "#",
    },
    {
      title: "Pricing",
      href: "#",
    },
    {
      title: "Awards",
      href: "#",
    },
  ];

  const brandList: BrandList[] = clientLogos.map((image, i) => ({
    image,
    name: `Client ${i + 1}`,
  }));

  return (
    <div
      className="dark relative min-h-screen overflow-hidden bg-black text-foreground"
      // Brand green as the primary colour; inline so it wins over the .dark theme tokens
      style={
        {
          "--primary": "#3BA778",
          "--primary-foreground": "#ffffff",
          "--ring": "#3BA778",
        } as React.CSSProperties
      }
    >
      <HeroBackdrop />
      <SplashCursor />
      {/* Bottom gradient fade to black */}
      <div className="absolute bottom-0 left-0 right-0 h-80 z-[5] pointer-events-none bg-gradient-to-b from-transparent via-black/70 to-black" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header navigationData={navigationData} />
        <main className="flex flex-1 flex-col justify-center">
          <HeroSection />
          <BrandSlider brandList={brandList} />
        </main>
      </div>
    </div>
  );
}
