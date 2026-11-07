'use client';

import { useEffect, useRef, useState } from 'react';
import { img } from '../lib/base';

/**
 * Настоящая 3D-модель плафона (сетка из 3MF), показываем в WebGL через three.js.
 * Цвет задаётся пропсом, размер масштабирует сам родитель (CSS), мышью можно вращать.
 */
type Props = {
  color: string;
  /** скорость вращения (в интерактивном режиме — автоповорот, иначе — вращение самой лампы) */
  spin?: number;
  /** можно ли крутить мышью */
  interactive?: boolean;
  /** подсветка цвета (0..1): делает лампу светлее */
  glow?: number;
  /** наклон лампы набок, градусы (плюс — влево) */
  tilt?: number;
  /** наклон верхом на зрителя, градусы */
  lean?: number;
};

export default function LampViewer({ color, spin = 1.4, interactive = true, glow = 0, tilt = 0, lean = 0 }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<{ setColor: (c: string) => void } | null>(null);
  const colorRef = useRef(color);
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    colorRef.current = color;
    api.current?.setColor(color);
  }, [color]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

        const res = await fetch(img('/models/shade.bin'));
        if (!res.ok) throw new Error('model');
        const buf = await res.arrayBuffer();
        const [nV, nT] = new Uint32Array(buf, 0, 2);
        const pos = new Float32Array(buf, 8, nV * 3);
        const idx = new Uint16Array(buf, 8 + nV * 12, nT * 3);
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.touchAction = 'pan-y';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
        camera.position.set(0, 0.55, 5.6);

        scene.add(new THREE.HemisphereLight(0xffffff, 0xd9cfc0, 1.1));
        const key = new THREE.DirectionalLight(0xffffff, 1.9);
        key.position.set(-2.5, 3.5, 3);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xfff0dd, 0.7);
        rim.position.set(3, 1, -3);
        scene.add(rim);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setIndex(new THREE.BufferAttribute(idx, 1));
        geo.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({
          color: colorRef.current,
          roughness: 0.8,
          metalness: 0,
          side: THREE.DoubleSide,
          emissive: new THREE.Color(colorRef.current),
          emissiveIntensity: glow,
        });
        const mesh = new THREE.Mesh(geo, mat);
        // лампа стоит в наклонённой оси: крутится вокруг себя, а наклон остаётся
        const pivot = new THREE.Group();
        pivot.rotation.z = (tilt * Math.PI) / 180;
        pivot.rotation.x = (lean * Math.PI) / 180;
        pivot.add(mesh);
        scene.add(pivot);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const controls = interactive ? new OrbitControls(camera, renderer.domElement) : null;
        if (controls) {
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.enableDamping = true;
          controls.minPolarAngle = Math.PI * 0.32;
          controls.maxPolarAngle = Math.PI * 0.6;
          controls.autoRotate = !reduced;
          controls.autoRotateSpeed = spin;
          controls.target.set(0, 0, 0);
        } else {
          camera.lookAt(0, 0, 0);
        }

        const resize = () => {
          const w = el.clientWidth || 280;
          const h = el.clientHeight || 280;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);

        let raf = 0;
        let visible = true;
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
        });
        io.observe(el);
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!visible) return;
          if (controls) controls.update();
          else if (!reduced) mesh.rotation.y += 0.0035 * spin;
          renderer.render(scene, camera);
        };
        loop();

        api.current = {
          setColor: (c: string) => {
            mat.color.set(c);
            mat.emissive.set(c);
          },
        };
        setState('ready');

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          controls?.dispose();
          geo.dispose();
          mat.dispose();
          renderer.dispose();
          renderer.domElement.remove();
          api.current = null;
        };
      } catch {
        if (!disposed) setState('fallback');
      }
    };

    // тяжёлую 3D-часть загружаем только когда лампа почти попала в окно (например, футер внизу страницы)
    const gate = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gate.disconnect();
          start();
        }
      },
      { rootMargin: '300px' }
    );
    gate.observe(el);

    return () => {
      disposed = true;
      gate.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div
      className={`lamp-viewer${interactive ? '' : ' lamp-static'}`}
      ref={box}
      aria-label={interactive ? '3D-модель плафона, можно вращать мышью' : '3D-модель плафона'}
      role="img"
    >
      {state !== 'ready' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="lamp-fallback" src={img('/img/lamp-shade.webp')} alt="" width={389} height={420} />
      )}
    </div>
  );
}
