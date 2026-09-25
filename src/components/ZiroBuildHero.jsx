"use client";

import Starfield from "./Starfield.jsx";
import logoWhite from "../assets/logo-white.svg";

function AnimatedText({ text }) {
  return (
    <span className="relative overflow-hidden inline-flex">
      <span className="transition-transform duration-500 ease-in-out group-hover:-translate-y-[120%] whitespace-nowrap">
        {text}
      </span>
      <span className="absolute inset-0 transition-transform duration-500 ease-in-out translate-y-[120%] group-hover:translate-y-0 whitespace-nowrap flex justify-center items-center">
        {text}
      </span>
    </span>
  );
}

export default function ZiroBuildHero({ className = "" }) {
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col overflow-hidden text-white font-sans bg-black ${className}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_170109_f96e01a5-b0db-4274-b24d-8d97e99ec928.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 grayscale"
      />
      {/* Recolors the grayscale video: keeps its luminosity, takes hue from the gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-color bg-[linear-gradient(135deg,#3BA778_0%,#1D60AB_100%)]" />
      {/* Drifting stars over the video, faded out before the planet's horizon */}
      <Starfield className="absolute inset-0 w-full h-full z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_35%,transparent_56%)]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-8 py-6 w-full max-w-[900px] mx-auto">
          <img src={logoWhite} alt="Spine" className="h-7 w-auto" />

          <button className="group px-5 py-2.5 border border-white/20 rounded-md text-sm font-medium hover:bg-white/10 transition-colors">
            <AnimatedText text="Get Started" />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-start pt-[12vh] pr-4 pl-[17px] max-w-5xl mx-auto text-center w-full mt-12 mb-[-80px] h-[680px]">
          <h1 className="text-[80px] leading-[88.6px] font-display font-medium tracking-tight mb-[20px]">
            Making brands unforgettable
          </h1>
        </main>
      </div>
    </div>
  );
}
