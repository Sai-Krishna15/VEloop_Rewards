import React, { useEffect, useRef } from 'react';

/**
 * ParticleCanvas — renders ambient floating particles on a canvas.
 * Particles drift upward, fade in/out, and have subtle twinkle pulses.
 * Completely passive — no user interaction needed.
 */
export default function ParticleCanvas({ count = 55 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Build particles ────────────────────────────────────────
    const rand  = (min, max) => Math.random() * (max - min) + min;
    const TYPES = ['circle', 'star', 'ring'];

    particles.current = Array.from({ length: count }, () => ({
      x:        rand(0, canvas.width),
      y:        rand(0, canvas.height),
      r:        rand(1, 3.5),
      vx:       rand(-0.15, 0.15),
      vy:       rand(-0.4, -0.08),
      opacity:  rand(0.1, 0.55),
      opDir:    Math.random() > 0.5 ? 1 : -1,
      opSpeed:  rand(0.003, 0.008),
      type:     TYPES[Math.floor(Math.random() * TYPES.length)],
      hue:      Math.random() > 0.6 ? 270 : (Math.random() > 0.5 ? 45 : 200),
      pulse:    rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.025),
    }));

    // ── Draw a star ────────────────────────────────────────────
    const drawStar = (cx, cy, r, opacity, hue) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = `hsl(${hue}, 90%, 75%)`;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-r * 0.2, -r, r * 0.4, r * 2);
        ctx.rotate(Math.PI / 2);
      }
      ctx.restore();
    };

    // ── Animation loop ─────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles.current) {
        // Twinkle
        p.pulse += p.pulseSpeed;
        const twinkle = 0.5 + 0.5 * Math.sin(p.pulse);

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Opacity breathe
        p.opacity += p.opDir * p.opSpeed;
        if (p.opacity >= 0.6 || p.opacity <= 0.05) p.opDir *= -1;

        // Wrap around
        if (p.y < -10)              p.y = canvas.height + 10;
        if (p.x < -10)              p.x = canvas.width  + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const alpha = p.opacity * twinkle;

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.r * 1.6, alpha, p.hue);
        } else if (p.type === 'ring') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = `hsl(${p.hue}, 80%, 70%)`;
          ctx.lineWidth   = 0.8;
          ctx.globalAlpha = alpha * 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else {
          // Soft glow circle
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          grad.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${alpha})`);
          grad.addColorStop(1, `hsla(${p.hue}, 90%, 80%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
