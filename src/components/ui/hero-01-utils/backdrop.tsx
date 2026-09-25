import PrismaticBurst from "@/components/PrismaticBurst/PrismaticBurst.jsx";

export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 pointer-events-auto">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={5}
          speed={0.4}
          distort={1.5}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={18}
          mixBlendMode="lighten"
          colors={['#3BA778', '#1D60AB', '#3BA778']}
        />
      </div>
    </div>
  );
}
