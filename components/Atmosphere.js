'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// ---- Tweak these to taste ----
const GLOW_RADIUS = 220;      // size of the candle glow, in px
const GLOW_STRENGTH = 0.18;   // 0 = invisible, 0.3 = strong
const EMBER_SHARE = 0.28;     // fraction of particles that are glowing embers (rest are dust)
const PUSH_RADIUS = 130;      // how far from the cursor particles get pushed away
const MAX_PARTICLES = 70;     // on large screens; phones get fewer
// ------------------------------

export default function Atmosphere() {
  const canvasRef = useRef(null);
  const pathname = usePathname();

  // No effects on the admin screens, where you want a calm workspace
  const enabled = !pathname.startsWith('/admin') && pathname !== '/login';

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect people who have turned animations off in their system settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    const coarse = window.matchMedia('(pointer: coarse)').matches; // phones and tablets

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let time = 0;

    const particles = [];
    const ripples = [];
    const mouse = { x: 0, y: 0, gx: 0, gy: 0, active: false, lastRipple: null };

    function makeParticle(initial) {
      const ember = Math.random() < EMBER_SHARE;
      return {
        ember,
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        r: ember ? 1 + Math.random() * 1.6 : 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 8,
        vy: ember ? -(14 + Math.random() * 22) : -(4 + Math.random() * 10),
        phase: Math.random() * Math.PI * 2,
        sway: 6 + Math.random() * 14,
        tw: 0.6 + Math.random() * 1.4,
        hue: Math.random() < 0.5 ? 24 : 338, // orange or pink (embers only)
        pvx: 0, // push from the cursor
        pvy: 0,
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = coarse ? 26 : Math.min(MAX_PARTICLES, Math.round((w * h) / 26000));
      while (particles.length < target) particles.push(makeParticle(true));
      particles.length = Math.min(particles.length, target);
    }

    function addRipple(x, y, amp) {
      ripples.push({ x, y, t: 0, amp });
    }

    function onMove(e) {
      if (e.pointerType === 'touch') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.active) {
        mouse.gx = mouse.x;
        mouse.gy = mouse.y;
        mouse.active = true;
      }
      if (!mouse.lastRipple) mouse.lastRipple = { x: mouse.x, y: mouse.y };

      // a faint ripple every ~140px of travel, like a finger trailing through water
      const dx = mouse.x - mouse.lastRipple.x;
      const dy = mouse.y - mouse.lastRipple.y;
      if (dx * dx + dy * dy > 140 * 140) {
        addRipple(mouse.x, mouse.y, 0.5);
        mouse.lastRipple = { x: mouse.x, y: mouse.y };
      }
    }

    function onDown(e) {
      addRipple(e.clientX, e.clientY, 1); // click or tap: a bigger triple ring
    }

    function onLeave() {
      mouse.active = false;
      mouse.lastRipple = null;
    }

    function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;

      ctx.clearRect(0, 0, w, h);

      // ---- candle glow ----
      if (mouse.active) {
        const k = Math.min(1, dt * 9); // easing: the glow trails the cursor slightly
        mouse.gx += (mouse.x - mouse.gx) * k;
        mouse.gy += (mouse.y - mouse.gy) * k;

        const flicker = 1 + Math.sin(time * 7.3) * 0.03 + Math.sin(time * 13.1) * 0.02;
        const r = GLOW_RADIUS * flicker;
        const g = ctx.createRadialGradient(mouse.gx, mouse.gy, 0, mouse.gx, mouse.gy, r);
        g.addColorStop(0, `rgba(255,178,96,${GLOW_STRENGTH})`);
        g.addColorStop(0.45, `rgba(224,100,110,${GLOW_STRENGTH * 0.35})`);
        g.addColorStop(1, 'rgba(224,69,123,0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.fillRect(mouse.gx - r, mouse.gy - r, r * 2, r * 2);
      }

      // ---- dust and embers ----
      ctx.globalCompositeOperation = 'lighter';
      const damp = Math.pow(0.12, dt);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < PUSH_RADIUS && d > 0.001) {
            const f = 1 - d / PUSH_RADIUS;
            p.pvx += (dx / d) * f * 520 * dt;
            p.pvy += (dy / d) * f * 520 * dt;
          }
        }

        p.phase += dt * p.tw;
        p.x += (p.vx + Math.sin(p.phase) * p.sway + p.pvx) * dt;
        p.y += (p.vy + p.pvy) * dt;
        p.pvx *= damp;
        p.pvy *= damp;

        if (p.y < -12 || p.y > h + 40 || p.x < -20 || p.x > w + 20) {
          particles[i] = makeParticle(false);
          continue;
        }

        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 2.2);
        const fade = Math.max(0, Math.min(1, p.y / (h * 0.2))); // fade out near the top
        const a = (p.ember ? 0.85 : 0.5) * twinkle * fade;
        if (a < 0.01) continue;

        if (p.ember) {
          ctx.fillStyle = `hsla(${p.hue},95%,62%,${a * 0.18})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `hsla(${p.hue},95%,66%,${a})`;
        } else {
          ctx.fillStyle = `hsla(40,60%,78%,${a})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- ripples ----
      ctx.globalCompositeOperation = 'source-over';
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.t += dt;
        const big = rp.amp >= 1;
        const rings = big ? 3 : 1;
        const life = 1.5;
        let alive = false;

        for (let k = 0; k < rings; k++) {
          const tt = rp.t - k * 0.18;
          if (tt < 0) {
            alive = true;
            continue;
          }
          const prog = tt / life;
          if (prog >= 1) continue;
          alive = true;

          const radius = 6 + prog * (big ? 120 : 70);
          const alpha = Math.pow(1 - prog, 2) * (big ? 0.55 : 0.28);

          ctx.beginPath();
          ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
          ctx.lineWidth = 1.6 - prog * 0.8;
          ctx.strokeStyle =
            k === 0 ? `rgba(201,163,95,${alpha})` : `rgba(224,69,123,${alpha})`;
          ctx.stroke();
        }

        if (!alive) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="atmosphere" aria-hidden="true" />;
}