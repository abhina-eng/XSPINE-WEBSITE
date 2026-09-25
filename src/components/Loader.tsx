import { useState, useRef, useCallback } from "react";
import DotReveal from "@/components/DotReveal";

type LoaderPhase = "video" | "dots" | "done";

interface LoaderProps {
  children: React.ReactNode;
}

export default function Loader({ children }: LoaderProps) {
  const [phase, setPhase] = useState<LoaderPhase>("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setPhase("dots");
  }, []);

  const handleDotsComplete = useCallback(() => {
    setPhase("done");
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <>
      {/* Hero always mounted — visible through transparent canvas */}
      <div className={phase === "dots" ? "opacity-100" : "opacity-0"} style={{ transition: "opacity 0.3s ease" }}>
        {children}
      </div>

      <div className="fixed inset-0 z-[100] pointer-events-none">
        {phase === "video" && (
          <div className="absolute inset-0 bg-black flex items-center justify-center animate-[fadeIn_0.2s_ease]">
            <video
              ref={videoRef}
              src="/loader.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {phase === "dots" && (
          <div className="absolute inset-0">
            <DotReveal
              color="#3BA778"
              secondaryColor="#1D60AB"
              cellSize={10}
              dotSize={0.8}
              duration={2.5}
              onComplete={handleDotsComplete}
            />
          </div>
        )}
      </div>
    </>
  );
}
