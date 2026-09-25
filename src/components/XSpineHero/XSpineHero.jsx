import { useEffect, useRef, useState } from 'react';
import { createXSpineHero } from './xspineHeroCore';

function useOverlayVisible(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const overlay = ref.current.closest('.scroll-expand__overlay');
    if (!overlay) { setVisible(true); return; }
    const check = () => parseFloat(overlay.style.opacity || getComputedStyle(overlay).opacity) > 0.3;
    if (check()) setVisible(true);
    const id = setInterval(() => {
      const v = check();
      setVisible(prev => (prev !== v ? v : prev));
    }, 150);
    return () => clearInterval(id);
  }, [ref]);
  return visible;
}

export default function XSpineHero({
  glbUrl = '/xspine/xspine-logo-color.glb',
  replayOnReenter = false,
  className = '',
  style
}) {
  const ref = useRef(null);
  const visible = useOverlayVisible(ref);

  useEffect(() => {
    if (!visible || !ref.current) return;
    const hero = createXSpineHero(ref.current, { glbUrl, replayOnReenter, autoplay: 'immediate' });
    return () => hero.destroy();
  }, [visible, glbUrl, replayOnReenter]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', cursor: 'crosshair', ...style }}
      aria-label="XSpine"
      role="img"
    />
  );
}
