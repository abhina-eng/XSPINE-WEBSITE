/**
 * XSpine glass logo
 * ------------------------------------------------------------
 * createXSpineHero(container, options) → { play, reset, destroy }
 *
 * 3D glass X logo with brand-colored rim lighting.
 * Rises from below while spinning, settles into slow idle rotation.
 * Drag to rotate with momentum.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const DEFAULTS = {
  glbUrl: '/xspine/xspine-logo-color.glb',
  autoplay: 'inview',
  replayOnReenter: false,
  inViewThreshold: 0.35,
  logoDelay: 0.1,
  logoDuration: 1.8,
  spinSpeed: 0.35,
  colors: {
    green: { hex: 0x3BA778, rim: 0x5cf0a0 },
    blue: { hex: 0x1D60AB, rim: 0x5a8cff }
  }
};

const clamp01 = v => Math.min(1, Math.max(0, v));
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeOutBack = t => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

export function createXSpineHero(container, options = {}) {
  const o = { ...DEFAULTS, ...options, colors: { ...DEFAULTS.colors, ...(options.colors || {}) } };
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.touchAction = 'pan-y';

  const lc = document.createElement('canvas');
  Object.assign(lc.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  container.append(lc);

  let W = 0, H = 0, DPR = 1, raf = 0, running = false, destroyed = false;
  let startTime = null;
  const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, active: false };

  const renderer = new THREE.WebGLRenderer({ canvas: lc, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  (function buildEnv() {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x050608, side: THREE.BackSide })));
    const panel = (w, h, x, y, z, c, s) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(s), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m);
    };
    panel(8, 2, 0, 6, 4, 0xffffff, 8);
    panel(2, 8, -7, 0, 3, 0xffffff, 3);
    panel(2, 8, 7, 0, 3, 0xffffff, 3);
    panel(4, 8, -6, 1, -5, o.colors.green.hex, 5);
    panel(4, 8, 6, 1, -5, o.colors.blue.hex, 5);
    panel(6, 3, 0, -4, -6, 0xffffff, 2);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.02).texture;
    pm.dispose();
  })();

  const core = new THREE.PointLight(0xffffff, 1.2, 1.5, 2); core.position.set(0, 0.02, 0.3); scene.add(core);
  const kG = new THREE.PointLight(o.colors.green.hex, 2.5, 8, 2); kG.position.set(-1.4, 0.6, 1.2); scene.add(kG);
  const kB = new THREE.PointLight(o.colors.blue.hex, 2.5, 8, 2); kB.position.set(1.4, -0.4, 1.2); scene.add(kB);
  const dirL = new THREE.DirectionalLight(0xffffff, 0.5); dirL.position.set(0.5, 1, 2); scene.add(dirL);

  function glassMaterial(tintHex, rimHex) {
    const tint = new THREE.Color(tintHex);
    const rim = new THREE.Color(rimHex);
    const m = new THREE.MeshPhysicalMaterial({
      color: tint.clone().lerp(new THREE.Color(0xffffff), 0.7),
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.55,
      thickness: 1.2,
      ior: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      envMapIntensity: 3.0,
      attenuationColor: tint,
      attenuationDistance: 0.3,
      sheen: 0.4,
      sheenRoughness: 0.2,
      sheenColor: rim,
      side: THREE.DoubleSide,
      transparent: true,
    });
    m.onBeforeCompile = sh => {
      sh.uniforms.rimColor = { value: rim };
      sh.uniforms.tintColor = { value: tint };
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 rimColor;\nuniform vec3 tintColor;')
        .replace('#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           float fres = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.2);
           totalEmissiveRadiance += rimColor * fres * 1.2;
           totalEmissiveRadiance += tintColor * pow(fres, 1.5) * 0.5;
           float specFlash = pow(fres, 5.0);
           totalEmissiveRadiance += vec3(1.0) * specFlash * 0.4;`);
    };
    return m;
  }

  const pivot = new THREE.Group();
  pivot.visible = false;
  scene.add(pivot);

  const flareTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.08, 'rgba(230,250,255,0.85)');
    grd.addColorStop(0.3, 'rgba(120,200,255,0.18)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const s = g.createLinearGradient(0, 0, 256, 0);
    s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(0.5, 'rgba(255,255,255,0.7)'); s.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = s; g.fillRect(0, 126, 256, 4);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true }));
  flare.position.set(0, 0.02, 0.12);
  flare.material.opacity = 0;
  scene.add(flare);

  let logoReady = false;
  new GLTFLoader().load(o.glbUrl, gltf => {
    if (destroyed) return;
    const root = gltf.scene;
    root.traverse(m => {
      if (!m.isMesh) return;
      const green = /green/i.test(m.name) || /green/i.test(m.material && m.material.name);
      m.material = green ? glassMaterial(o.colors.green.hex, o.colors.green.rim) : glassMaterial(o.colors.blue.hex, o.colors.blue.rim);
    });
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
    root.position.sub(ctr);
    const holder = new THREE.Group(); holder.scale.setScalar(1 / size.y); holder.add(root);
    pivot.add(holder);
    logoReady = true;
  }, undefined, err => console.error('[XSpineHero] GLB failed to load', err));

  let viewHalfH = 1;
  function resize() {
    const b = container.getBoundingClientRect();
    W = Math.max(1, b.width); H = Math.max(1, b.height);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const frac = Math.min(0.32, 0.34 * camera.aspect);
    const dist = 1 / (frac * 2 * Math.tan(THREE.MathUtils.degToRad(15)));
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    viewHalfH = dist * Math.tan(THREE.MathUtils.degToRad(15));
  }

  let tiltX = 0, tiltY = 0, last = performance.now(), idleSpin = 0;
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const elapsed = startTime === null ? -1 : (now - startTime) / 1000;

    const lp = startTime === null ? 0 : reduceMotion ? 1 : clamp01((elapsed - o.logoDelay) / o.logoDuration);
    pivot.visible = logoReady && lp > 0;
    const rise = easeOutBack(lp);
    const entrySpin = (1 - easeOutCubic(lp)) * Math.PI * 3;
    idleSpin += dt * o.spinSpeed * (lp >= 1 ? 1 : lp);
    if (!drag.active) {
      drag.velX *= 0.95;
      drag.velY *= 0.95;
      drag.dragX += drag.velX;
      drag.dragY += drag.velY;
    }
    const tx = pointer.active && !drag.active ? (pointer.y / H - 0.5) * -0.25 : 0;
    const ty = pointer.active && !drag.active ? (pointer.x / W - 0.5) * 0.3 : 0;
    tiltX += (tx - tiltX) * 0.05; tiltY += (ty - tiltY) * 0.05;
    const spin = idleSpin + entrySpin + drag.dragX;
    pivot.rotation.set(tiltX + (1 - rise) * 0.5 + drag.dragY, spin + tiltY, 0);
    pivot.position.y = -(viewHalfH + 0.7) * (1 - rise) + Math.sin(now * 0.0009) * 0.02 * lp;
    const sc = 0.7 + 0.3 * easeOutCubic(lp);
    pivot.scale.setScalar(sc);

    const facing = Math.abs(Math.cos(spin));
    const flareIn = clamp01((lp - 0.75) / 0.25);
    flare.material.opacity = flareIn * (0.25 + 0.75 * Math.pow(facing, 3));
    flare.position.y = pivot.position.y + 0.02;
    flare.scale.setScalar(0.5 * (0.9 + 0.1 * Math.sin(now * 0.002)) * (0.7 + 0.3 * facing));
    core.intensity = (0.35 + 0.45 * facing) * lp;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function startLoop() { if (running || destroyed) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }

  function play() { idleSpin = 0; startTime = performance.now(); startLoop(); }
  function reset() { startTime = null; }

  const drag = { active: false, lastX: 0, lastY: 0, velX: 0, velY: 0, dragX: 0, dragY: 0 };
  const setPointer = e => {
    const b = container.getBoundingClientRect();
    pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top;
    if (!pointer.active) { pointer.px = pointer.x; pointer.py = pointer.y; }
    pointer.active = true;
    if (drag.active) {
      const dx = e.clientX - drag.lastX, dy = e.clientY - drag.lastY;
      drag.velX = dx * 0.01; drag.velY = dy * 0.01;
      drag.dragX += dx * 0.01; drag.dragY += dy * 0.005;
      drag.lastX = e.clientX; drag.lastY = e.clientY;
    }
  };
  const onDown = e => {
    setPointer(e);
    drag.active = true; drag.lastX = e.clientX; drag.lastY = e.clientY;
    drag.velX = 0; drag.velY = 0;
    container.setPointerCapture(e.pointerId);
  };
  const leave = () => { pointer.active = false; };
  const onUp = e => {
    if (e.pointerType !== 'mouse') pointer.active = false;
    drag.active = false;
  };
  container.addEventListener('pointermove', setPointer);
  container.addEventListener('pointerdown', onDown);
  container.addEventListener('pointerleave', leave);
  container.addEventListener('pointerup', onUp);

  const ro = new ResizeObserver(() => resize());
  ro.observe(container);

  let played = false;
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      startLoop();
      if (o.autoplay === 'inview' && entry.intersectionRatio >= o.inViewThreshold && (!played || o.replayOnReenter)) {
        played = true; play();
      }
    } else {
      stopLoop();
      if (o.replayOnReenter) reset();
    }
  }, { threshold: [0, o.inViewThreshold] });

  resize();
  io.observe(container);
  if (o.autoplay === 'immediate') { played = true; play(); }

  function destroy() {
    destroyed = true; stopLoop(); io.disconnect(); ro.disconnect();
    container.removeEventListener('pointermove', setPointer);
    container.removeEventListener('pointerdown', onDown);
    container.removeEventListener('pointerleave', leave);
    container.removeEventListener('pointerup', onUp);
    scene.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); });
    if (scene.environment) scene.environment.dispose();
    flareTex.dispose();
    renderer.dispose();
    lc.remove();
  }

  return { play, reset, destroy };
}
