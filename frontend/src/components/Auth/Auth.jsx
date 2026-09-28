import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Flame, Zap, Gift, Star } from 'lucide-react';
import { login, register } from '../../services/streakApi';
import styles from './Auth.module.css';

/* ──────────────────────────────────────────────────────────────
   Animated mesh-gradient canvas background
   ────────────────────────────────────────────────────────────── */
function SceneCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    let   raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* — particles — */
    const rand = (a, b) => Math.random() * (b - a) + a;
    const pts  = Array.from({ length: 65 }, () => ({
      x:  rand(0, canvas.width),
      y:  rand(0, canvas.height),
      vx: rand(-0.1, 0.1),
      vy: rand(-0.25, -0.04),
      r:  rand(0.8, 2.4),
      op: rand(0.05, 0.45),
      dir: 1,
      hue: [265, 270, 280, 255, 290][Math.floor(Math.random() * 5)],
      phase: rand(0, Math.PI * 2),
      ps:   rand(0.007, 0.018),
    }));

    /* — 3 large nebula blobs — all deep purple family, slow drift — */
    const blobs = [
      { x: 0.2,  y: 0.25, r: 420, hue: 265, vx: 0.00012, vy: 0.00006 },
      { x: 0.78, y: 0.5,  r: 280, hue: 275, vx:-0.0001,  vy: 0.00008 },
      { x: 0.45, y: 0.85, r: 240, hue: 258, vx: 0.00008, vy:-0.00006 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      /* nebula blobs */
      blobs.forEach(b => {
        b.x = Math.max(0.05, Math.min(0.95, b.x + b.vx));
        b.y = Math.max(0.05, Math.min(0.95, b.y + b.vy));
        const gx = b.x * W, gy = b.y * H;
        const g  = ctx.createRadialGradient(gx, gy, 0, gx, gy, b.r);
        g.addColorStop(0, `hsla(${b.hue},80%,55%,0.12)`);
        g.addColorStop(1, `hsla(${b.hue},80%,55%,0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      /* particles */
      for (const p of pts) {
        p.phase += p.ps;
        p.x += p.vx; p.y += p.vy;
        p.op += p.dir * 0.003;
        if (p.op > 0.55 || p.op < 0.04) p.dir *= -1;
        if (p.y < -8) p.y = H + 8;
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        const a = p.op * (0.5 + 0.5 * Math.sin(p.phase));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        g.addColorStop(0, `hsla(${p.hue},90%,78%,${a})`);
        g.addColorStop(1, `hsla(${p.hue},90%,78%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className={styles.sceneCanvas} />;
}

/* ──────────────────────────────────────────────────────────────
   Animated ring "aura" behind the reward day icons
   ────────────────────────────────────────────────────────────── */
const REWARDS = [
  { day: 1, label: 'Day 1', value: '+10 VEs',  icon: Zap,  color: '#7c3aed', bg: 'rgba(124,58,237,0.15)', delay: '0s'    },
  { day: 4, label: 'Day 4', value: '+₹2',       icon: Gift, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', delay: '0.18s' },
  { day: 7, label: 'Day 7', value: '+₹5 🎁',    icon: Star, color: '#10b981', bg: 'rgba(16,185,129,0.15)', delay: '0.36s' },
];

/* ──────────────────────────────────────────────────────────────
   Main Auth Component
   ────────────────────────────────────────────────────────────── */
export default function Auth({ onAuthSuccess }) {
  const [isLogin,  setIsLogin]  = useState(true);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [focused,  setFocused]  = useState(null);
  const [tilt,     setTilt]     = useState({ rx: 0, ry: 0 });
  const [mouse,    setMouse]    = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);

  /* 3-D mouse tilt on card */
  const onMouseMove = useCallback((e) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    setMouse({ x: e.clientX / vw, y: e.clientY / vh });

    if (cardRef.current) {
      const r  = cardRef.current.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2))  / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      setTilt({ rx: -dy * 9, ry: dx * 9 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        localStorage.setItem('token', res.token);
        onAuthSuccess(res.token);
      } else {
        await register(email, password);
        const res = await login(email, password);
        localStorage.setItem('token', res.token);
        onAuthSuccess(res.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <SceneCanvas />

      {/* ═══════ DESKTOP LAYOUT ═══════════════════════════════ */}
      <div className={styles.layout}>

        {/* ── LEFT: Brand ─────────────────────────────────── */}
        <aside className={styles.brand}>

          {/* Logo */}
          <div className={styles.logo}
            style={{ transform: `translate(${(mouse.x-0.5)*14}px,${(mouse.y-0.5)*8}px)` }}>
            <div className={styles.logoIcon}>
              <Flame size={22} color="#f59e0b" />
            </div>
            <span className={styles.logoText}>VELoop</span>
          </div>

          {/* Hero heading with parallax */}
          <div className={styles.heroText}
            style={{ transform: `translate(${(mouse.x-0.5)*20}px,${(mouse.y-0.5)*12}px)` }}>
            <div className={styles.pillBadge}>
              <Zap size={12} /> Daily Streak Rewards
            </div>
            <h1 className={styles.heroH1}>
              Earn Real<br />
              <span className={styles.gradText}>Rewards Daily.</span>
            </h1>
            <p className={styles.heroP}>
              Login every day, keep your streak alive,<br />
              and unlock exclusive VEs coins & Amazon Gift Cards.
            </p>
          </div>

          {/* Reward showcase — floating 3-D cards */}
          <div className={styles.rewardShowcase}
            style={{ transform: `translate(${(mouse.x-0.5)*26}px,${(mouse.y-0.5)*16}px)` }}>
            {REWARDS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.day} className={styles.rewardTile}
                  style={{ '--rc': r.color, '--rb': r.bg, animationDelay: r.delay }}>
                  <div className={styles.rewardTileIcon} style={{ background: r.bg }}>
                    <Icon size={16} color={r.color} />
                  </div>
                  <div className={styles.rewardTileInfo}>
                    <span className={styles.rewardTileDay}>{r.label}</span>
                    <span className={styles.rewardTileVal} style={{ color: r.color }}>{r.value}</span>
                  </div>
                  <div className={styles.rewardTileDot} style={{ background: r.color }} />
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT: Auth Card ─────────────────────────────── */}
        <main className={styles.authSide}>
          <div
            ref={cardRef}
            className={styles.card}
            style={{ transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
          >

            {/* Moving light inside card */}
            <div className={styles.cardInnerLight}
              style={{ background: `radial-gradient(ellipse at ${50+tilt.ry*4}% ${50-tilt.rx*4}%, rgba(124,58,237,0.22) 0%, transparent 65%)` }} />

            {/* Mode toggle tabs */}
            <div className={styles.modeTabs}>
              <button
                type="button"
                className={`${styles.modeTab} ${isLogin ? styles.modeTabActive : ''}`}
                onClick={() => { setIsLogin(true); setError(null); }}
              >Sign In</button>
              <button
                type="button"
                className={`${styles.modeTab} ${!isLogin ? styles.modeTabActive : ''}`}
                onClick={() => { setIsLogin(false); setError(null); }}
              >Sign Up</button>
            </div>

            {/* Heading */}
            <div className={styles.cardHead}>
              <div className={styles.cardIconBadge}>
                <Flame size={24} color="#f59e0b" />
              </div>
              <h2 className={styles.cardTitle}>
                {isLogin ? 'Welcome back!' : 'Start your streak'}
              </h2>
              <p className={styles.cardSub}>
                {isLogin ? 'Sign in to continue your streak' : 'Create a free account today'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className={styles.errorBox} role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Email */}
              <div className={`${styles.field} ${focused==='email' ? styles.fieldFocused : ''}`}>
                <label htmlFor="ve-email" className={styles.fieldLabel}>Email address</label>
                <div className={styles.fieldInner}>
                  <Mail size={15} className={styles.fieldIcon} />
                  <input
                    id="ve-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={styles.fieldInput}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`${styles.field} ${focused==='password' ? styles.fieldFocused : ''}`}>
                <label htmlFor="ve-password" className={styles.fieldLabel}>Password</label>
                <div className={styles.fieldInner}>
                  <Lock size={15} className={styles.fieldIcon} />
                  <input
                    id="ve-password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className={styles.fieldInput}
                    placeholder="••••••••"
                  />
                  <button type="button" className={styles.eyeToggle}
                    onClick={() => setShowPwd(!showPwd)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}>
                    {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <><span className={styles.spinner} /> Processing...</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={17} className={styles.btnArrow}/></>
                )}
              </button>
            </form>

            {/* Footer toggle */}
            <p className={styles.cardFooter}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button type="button" className={styles.footerLink}
                onClick={() => { setIsLogin(!isLogin); setError(null); }}>
                {isLogin ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
