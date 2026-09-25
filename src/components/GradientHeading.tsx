import { useRef, useEffect, useState } from "react";

export default function GradientHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    };
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
  }, []);

  return (
    <h2
      ref={ref}
      className="text-center text-3xl md:text-[56px] font-bold leading-none cursor-default"
      style={{
        backgroundImage: hovering
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, #3BA778 0%, #1D60AB 50%, #ffffff 80%)`
          : "none",
        WebkitBackgroundClip: hovering ? "text" : "unset",
        WebkitTextFillColor: hovering ? "transparent" : "#ffffff",
        backgroundClip: hovering ? "text" : "unset",
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </h2>
  );
}
