'use client';

import React, { useEffect, useRef } from 'react';

interface TubesInstance {
  tubes?: {
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
  dispose?: () => void;
}

export default function TubesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let tubesApp: TubesInstance | null = null;
    let fakePointerRAF: number | null = null;
    let touchResumeTimeout: NodeJS.Timeout | null = null;
    let isUserTouching = false;
    let isDestroyed = false;

    const randomHex = () =>
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    const randomColors = (count: number) =>
      Array.from({ length: count }, () => randomHex());

    function randomizeColors() {
      if (!tubesApp || !tubesApp.tubes) return;
      const tubesCols = randomColors(3);
      const lightsCols = randomColors(4);
      tubesApp.tubes.setColors(tubesCols);
      tubesApp.tubes.setLightsColors(lightsCols);
    }

    async function initTubes() {
      if (!canvasRef.current || isDestroyed) return;

      try {
        let TubesCursor:
          | ((
              canvas: HTMLCanvasElement,
              options: Record<string, unknown>
            ) => TubesInstance)
          | null = null;

        // Multi-tier robust loader:
        // 1. Try local self-hosted public asset with native browser dynamic import
        try {
          const importFn = new Function('url', 'return import(url)');
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const mod = await importFn(`${basePath}/tubes1.min.js`);
          TubesCursor = mod.default;
        } catch {
          // 2. Try npm package module
          try {
            // @ts-expect-error - dynamic module import
            const mod = await import('threejs-components/build/cursors/tubes1.min.js');
            TubesCursor = mod.default;
          } catch {
            // 3. Fallback to CDN using native dynamic import
            try {
              const importFn = new Function('url', 'return import(url)');
              const mod = await importFn(
                'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
              );
              TubesCursor = mod.default;
            } catch (cdnErr) {
              console.warn('All TubesCursor loaders failed:', cdnErr);
            }
          }
        }

        if (!TubesCursor || isDestroyed || !canvasRef.current) return;

        const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

        tubesApp = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#00f2fe', '#0072ff', '#ffffff'],
            lights: {
              intensity: 240,
              colors: ['#00f2fe', '#38bdf8', '#0072ff', '#a855f7'],
            },
          },
          sleepRadiusX: isMobile ? 360 : 180,
          sleepRadiusY: isMobile ? 480 : 120,
          sleepTimeScale1: 0.8,
          sleepTimeScale2: 1.5,
        });

        // ----------------------------------------------------
        // Mobile-Only Fake Pointer Motion Engine
        // ----------------------------------------------------
        const fakePointerStartTime = performance.now();

        function isMobileScreen() {
          return (
            window.innerWidth <= 768 ||
            (window.matchMedia &&
              window.matchMedia('(max-width: 768px), (pointer: coarse)').matches)
          );
        }

        function runMobileFakePointer() {
          if (isDestroyed) return;

          if (isMobileScreen() && !isUserTouching && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              const elapsed = (performance.now() - fakePointerStartTime) * 0.001;
              const t = elapsed * 0.85;
              const padX = rect.width * 0.12;
              const padY = Math.min(rect.height * 0.15, 90);

              const minX = rect.left + padX;
              const maxX = rect.left + rect.width - padX;
              const minY = Math.max(rect.top + padY, 40);
              const maxY = Math.min(
                rect.top + rect.height - padY,
                window.innerHeight - 50
              );

              const midX = (minX + maxX) / 2;
              const spanX = Math.max(20, (maxX - minX) / 2);
              const midY = (minY + maxY) / 2;
              const spanY = Math.max(20, (maxY - minY) / 2);

              const fakeX =
                midX +
                spanX * (Math.sin(t * 0.8) * 0.75 + Math.cos(t * 1.5 + 0.6) * 0.25);
              const fakeY =
                midY +
                spanY * (Math.cos(t * 0.6) * 0.72 + Math.sin(t * 1.25 + 1.1) * 0.28);

              let pEvent: PointerEvent | MouseEvent;
              try {
                pEvent = new PointerEvent('pointermove', {
                  clientX: fakeX,
                  clientY: fakeY,
                  screenX: fakeX,
                  screenY: fakeY,
                  bubbles: true,
                  cancelable: true,
                  pointerType: 'mouse',
                  isPrimary: true,
                });
              } catch {
                pEvent = new MouseEvent('mousemove', {
                  clientX: fakeX,
                  clientY: fakeY,
                  bubbles: true,
                  cancelable: true,
                });
              }

              try {
                Object.defineProperty(pEvent, 'clientX', { value: fakeX });
                Object.defineProperty(pEvent, 'clientY', { value: fakeY });
              } catch {}

              document.body.dispatchEvent(pEvent);
              canvasRef.current.dispatchEvent(pEvent);
            }
          }
          fakePointerRAF = requestAnimationFrame(runMobileFakePointer);
        }

        runMobileFakePointer();
      } catch (err) {
        console.warn(
          '3D Tubes WebGL could not load (falling back to ambient CSS glow):',
          err
        );
      }
    }

    function onTouchStart() {
      isUserTouching = true;
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
    }

    function onTouchEnd() {
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      try {
        document.body.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
      } catch {}
      touchResumeTimeout = setTimeout(() => {
        isUserTouching = false;
      }, 800);
    }

    function handleClick(e: MouseEvent) {
      if (
        window.scrollY < 850 &&
        !(e.target as HTMLElement)?.closest(
          'input, select, button, a, form, .timeline-item, .glass-panel, .nav-links'
        )
      ) {
        randomizeColors();
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    document.addEventListener('click', handleClick);

    initTubes();

    return () => {
      isDestroyed = true;
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('click', handleClick);

      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      if (fakePointerRAF !== null) cancelAnimationFrame(fakePointerRAF);
      if (tubesApp?.dispose) {
        try {
          tubesApp.dispose();
        } catch {}
      }
    };
  }, []);

  return (
    <>
      {/* Interactive 3D Tubes Canvas Container */}
      <div className="tubes-canvas-container">
        <canvas ref={canvasRef} id="tubes-canvas" />
      </div>

      {/* Ambient Glow Fallback / Underlay */}
      <div className="background-elements">
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />
      </div>
    </>
  );
}
