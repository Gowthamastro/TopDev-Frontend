import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .lp-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--glass-border);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 48px;
                }
                .lp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
                .lp-logo-icon { width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lp-logo-text { color: var(--color-text); font-size: 20px; font-weight: 800; letter-spacing: -0.5px; font-family: 'Manrope', sans-serif; }

                .lp-nav-links { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; background: var(--color-bg-tertiary); padding: 6px 8px; border-radius: 999px; border: 1px solid var(--color-border-subtle); }
                .lp-nav-link { color: var(--color-text-muted); font-size: 14px; font-weight: 500; padding: 6px 16px; border-radius: 999px; text-decoration: none; transition: all 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-nav-link:hover { color: var(--color-text); background: var(--color-bg-secondary); }
                .lp-nav-actions { display: flex; align-items: center; gap: 20px; }
                .lp-login { color: var(--color-text-muted); font-size: 14px; text-decoration: none; transition: color 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-login:hover { color: var(--color-text); }
                .lp-btn-primary { background: var(--color-primary); border: none; color: var(--color-bg); font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; }
                .lp-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
                .lp-btn-secondary { background: var(--color-bg-secondary); border: 1px solid var(--color-border); color: var(--color-text); font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; }
                .lp-btn-secondary:hover { background: var(--color-bg-tertiary); }

                .lp-theme-toggle {
                    background: none; border: none; cursor: pointer; padding: 8px; color: var(--color-text-muted);
                    display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;
                }
                .lp-theme-toggle:hover { background: var(--color-bg-secondary); color: var(--color-text); }

                .lp-main { position: relative; z-index: 1; }
                .lp-section { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 48px; }

                /* Hero */
                .lp-hero { display: flex; align-items: center; gap: 64px; padding: 112px 48px 96px; max-width: 1200px; margin: 0 auto; }
                .lp-hero-copy { flex: 1; display: flex; flex-direction: column; gap: 28px; }
                .lp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--color-border); background: var(--color-bg-secondary); width: fit-content; }
                .lp-badge-text { color: var(--color-text-muted); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Manrope', sans-serif; }
                .lp-h1 { font-size: clamp(52px, 6vw, 82px); font-weight: 900; line-height: 1.02; letter-spacing: -3px; margin: 0; color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-h1-dim { color: var(--color-text-subtle); }
                .lp-h1-grad { color: var(--color-text); }
                .lp-tagline { color: var(--color-text-muted); font-size: 18px; font-weight: 400; line-height: 1.7; max-width: 480px; margin: 0; }
                .lp-cta-row { display: flex; flex-wrap: wrap; gap: 16px; }
                .lp-btn-hero { font-size: 16px; padding: 16px 32px; }
                .lp-social-proof { display: flex; align-items: center; gap: 16px; }
                .lp-avatars { display: flex; }
                .lp-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 2px solid var(--color-bg); margin-left: -8px; }
                .lp-av:first-child { margin-left: 0; }
                .lp-proof-text { color: var(--color-text-muted); font-size: 14px; }
                .lp-proof-text strong { color: var(--color-text); }

                /* Hero card */
                .lp-hero-card-wrap { flex-shrink: 0; width: 420px; position: relative; }
                .lp-glass { background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 4px; }
                .lp-profile-card { padding: 24px; animation: floatY 6s ease-in-out infinite; }
                @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                .lp-card-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--color-border-subtle); }
                .lp-card-id { display: flex; align-items: center; gap: 16px; }
                .lp-card-name { color: var(--color-text); font-weight: 700; font-size: 18px; font-family: 'Manrope', sans-serif; }
                .lp-card-role { color: var(--color-text-muted); font-size: 12px; margin-top: 2px; }
                .lp-float-badge { position: absolute; bottom: -32px; left: -24px; padding: 16px; border-radius: 4px; display: flex; align-items: center; gap: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.08); animation: floatY 7s ease-in-out infinite 1s; background: var(--color-surface); }
                .lp-float-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--color-bg-secondary); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lp-float-title { color: var(--color-text); font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; }
                .lp-float-sub { color: var(--color-text-muted); font-size: 12px; margin-top: 2px; }
                .lp-float-stat { position: absolute; top: -24px; right: -16px; padding: 12px 16px; border-radius: 4px; animation: floatY 5s ease-in-out infinite 0.5s; background: var(--color-primary); }
                .lp-stat-label { color: var(--color-text-muted); opacity: 0.6; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'Manrope', sans-serif; }
                .lp-stat-val { color: var(--color-bg); font-size: 22px; font-weight: 900; font-family: 'Manrope', sans-serif; }
                .lp-stat-unit { color: var(--color-bg); opacity: 0.7; font-size: 14px; font-weight: 600; }

                /* Trusted by strip */
                .lp-trusted { border-top: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); padding: 40px 48px; background: var(--color-bg-secondary); }
                .lp-trusted-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 32px; }
                .lp-trusted-label { color: var(--color-text-subtle); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; font-family: 'Manrope', sans-serif; }
                .lp-logos { display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; opacity: 0.4; }
                .lp-logo-item { display: flex; align-items: center; gap: 8px; color: var(--color-text); font-size: 18px; font-weight: 700; font-family: 'Manrope', sans-serif; }

                /* Problem section */
                .lp-problem { padding: 112px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-section-hd { text-align: center; margin-bottom: 64px; }
                .lp-h2 { font-size: clamp(36px, 4vw, 48px); font-weight: 900; letter-spacing: -1.5px; color: var(--color-text); margin: 0 0 20px; font-family: 'Manrope', sans-serif; }
                .lp-h2-purple { color: var(--color-text-muted); }
                .lp-subtext { color: var(--color-text-muted); font-size: 18px; font-weight: 400; line-height: 1.7; max-width: 640px; margin: 0 auto; }
                .lp-cards3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
                .lp-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: 32px; transition: all 0.3s; }
                .lp-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-card-icon { width: 56px; height: 56px; background: var(--color-bg-secondary); border: 1px solid var(--color-border-subtle); border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
                .lp-card-h { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.3px; font-family: 'Manrope', sans-serif; }
                .lp-card-p { color: var(--color-text-muted); font-size: 15px; line-height: 1.65; margin: 0; font-weight: 400; }

                /* Process section */
                .lp-process { padding: 96px 48px; max-width: 1280px; margin: 0 auto; }
                .lp-h2-grad { color: var(--color-text); }
                .lp-process-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; position: relative; margin-top: 80px; }
                .lp-proc-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; display: flex; flex-direction: column; position: relative; z-index: 1; overflow: hidden; transition: all 0.3s; }
                .lp-proc-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-step-num { position: absolute; top: 0; left: 0; width: 56px; height: 56px; background: var(--color-primary); border-radius: 0 0 4px 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: var(--color-bg); z-index: 2; font-family: 'Manrope', sans-serif; }
                .lp-proc-body { padding: 80px 32px 32px; display: flex; flex-direction: column; flex: 1; }
                .lp-proc-h { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 12px; font-family: 'Manrope', sans-serif; }
                .lp-proc-p { color: var(--color-text-muted); font-size: 15px; line-height: 1.65; font-weight: 400; margin: 0 0 32px; }
                .lp-proc-vis { margin-top: auto; border-radius: 4px; overflow: hidden; border: 1px solid var(--color-border); }
                .lp-upload-vis { background: var(--color-bg-secondary); border: 2px dashed var(--color-border); border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
                .lp-upload-vis:hover { background: var(--color-bg-tertiary); }
                .lp-upload-label { color: var(--color-text); font-size: 13px; font-weight: 700; margin-top: 12px; font-family: 'Manrope', sans-serif; }
                .lp-upload-sub { color: var(--color-text-subtle); font-size: 12px; margin-top: 4px; }
                .lp-code-vis { background: var(--color-bg-tertiary); }
                .lp-code-titlebar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--color-border-subtle); background: var(--color-bg-secondary); }
                .lp-dots { display: flex; gap: 6px; }
                .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
                .lp-code-filename { color: var(--color-text-muted); font-size: 11px; font-family: monospace; flex: 1; text-align: center; }
                .lp-code-body { padding: 16px; font-family: monospace; color: var(--color-text); font-size: 11px; line-height: 1.7; white-space: pre; overflow: hidden; }
                .lp-result-vis { background: var(--color-bg-secondary); padding: 20px; }
                .lp-mini-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .lp-mini-av { width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--color-bg); font-size: 13px; flex-shrink: 0; }
                .lp-mini-name { color: var(--color-text); font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; }
                .lp-mini-role { color: var(--color-text-muted); font-size: 11px; margin-top: 2px; }
                .lp-mini-badge { margin-left: auto; padding: 2px 8px; border-radius: 9999px; background: var(--color-bg-tertiary); color: var(--color-text); font-size: 10px; font-weight: 700; border: 1px solid var(--color-border-subtle); text-transform: uppercase; font-family: 'Manrope', sans-serif; }
                .lp-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
                .lp-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--color-text-muted); }

                /* Pricing section */
                .lp-pricing { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-plans { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; align-items: end; margin-top: 64px; max-width: 800px; margin-left: auto; margin-right: auto; }
                .lp-plan { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: 32px; display: flex; flex-direction: column; height: 510px; transition: all 0.3s; }
                .lp-plan:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                .lp-plan-featured { border-color: var(--color-primary) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 560px; transform: translateY(-16px); position: relative; }
                .lp-popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: var(--color-bg); font-size: 10px; font-weight: 900; padding: 6px 20px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap; font-family: 'Manrope', sans-serif; }
                .lp-plan-name { color: var(--color-text); font-size: 20px; font-weight: 700; margin: 0 0 8px; font-family: 'Manrope', sans-serif; }
                .lp-plan-featured .lp-plan-name { font-size: 24px; font-weight: 900; margin-top: 16px; }
                .lp-plan-desc { color: var(--color-text-muted); font-size: 14px; line-height: 1.6; margin: 0 0 32px; }
                .lp-plan-featured .lp-plan-desc { color: var(--color-text); }
                .lp-price { font-size: 48px; font-weight: 900; color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-price-unit { font-size: 14px; font-weight: 500; color: var(--color-text-muted); margin-left: 8px; }
                .lp-price-mb { margin-bottom: 32px; }
                .lp-plan-featured .lp-feature { color: var(--color-text); font-weight: 500; }
                .lp-plan-btn { margin-top: 32px; border-radius: 999px; height: 48px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); font-family: 'Manrope', sans-serif; }
                .lp-plan-btn:hover { background: var(--color-bg-secondary); }
                .lp-plan-btn-primary { height: 56px; background: var(--color-primary); border: none; color: var(--color-bg); font-weight: 700; font-size: 14px; }
                .lp-plan-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

                /* CTA */
                .lp-cta-wrap { max-width: 1000px; margin: 0 auto; padding: 0 48px 128px; }
                .lp-cta-box { background: var(--color-primary); border-radius: 4px; padding: 64px; display: flex; align-items: center; justify-content: space-between; gap: 32px; position: relative; overflow: hidden; }
                .lp-cta-copy { position: relative; z-index: 1; }
                .lp-cta-h { color: var(--color-bg); font-size: clamp(24px, 3vw, 36px); font-weight: 900; margin: 0 0 12px; font-family: 'Manrope', sans-serif; }
                .lp-cta-sub { color: var(--color-bg); opacity: 0.6; font-size: 18px; margin: 0; }
                .lp-cta-action { position: relative; z-index: 1; flex-shrink: 0; }
                .lp-btn-white { display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; border-radius: 999px; background: var(--color-bg); color: var(--color-text); font-size: 14px; font-weight: 900; text-decoration: none; white-space: nowrap; transition: all 0.2s; font-family: 'Manrope', sans-serif; }
                .lp-btn-white:hover { opacity: 0.9; transform: translateY(-1px); }

                /* Footer */
                .lp-footer { border-top: 1px solid var(--color-border-subtle); background: var(--color-bg-secondary); padding: 64px 48px 32px; }
                .lp-footer-inner { max-width: 1200px; margin: 0 auto; }
                .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 64px; }
                .lp-footer-brand p { color: var(--color-text-muted); font-size: 15px; line-height: 1.6; max-width: 280px; margin: 20px 0 0; }
                .lp-footer-col-h { color: var(--color-text); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; font-family: 'Manrope', sans-serif; }
                .lp-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
                .lp-footer-links a { color: var(--color-text-muted); font-size: 14px; text-decoration: none; transition: color 0.2s; }
                .lp-footer-links a:hover { color: var(--color-text); }
                .lp-footer-bottom { border-top: 1px solid var(--color-border-subtle); padding-top: 32px; display: flex; align-items: center; justify-content: space-between; }
                .lp-copyright { color: var(--color-text-subtle); font-size: 14px; }
                .lp-social { display: flex; align-items: center; gap: 20px; }
                .lp-social a { color: var(--color-text-subtle); transition: color 0.2s; text-decoration: none; }
                .lp-social a:hover { color: var(--color-text); }

                @media (max-width: 1024px) {
                    .lp-hero { flex-direction: column; padding: 80px 24px 64px; }
                    .lp-hero-card-wrap { width: 100%; max-width: 420px; }
                    .lp-cards3, .lp-process-cards, .lp-plans { grid-template-columns: 1fr; }
                    .lp-plan-featured { transform: none; height: auto; }
                    .lp-footer-grid { grid-template-columns: 1fr 1fr; }
                    .lp-nav { padding: 14px 24px; }
                    .lp-nav-links { display: none; }
                    .lp-cta-box { flex-direction: column; text-align: center; }
                }
            `}</style>

            {/* ── NAVBAR ── */}
            <header className="lp-nav">
                <Link to="/" className="lp-logo">
                    <div className="lp-logo-icon">
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 18, lineHeight: 1 }}>bolt</span>
                    </div>
                    <span className="lp-logo-text">TopDev</span>
                </Link>
                <nav className="lp-nav-links">
                    <Link to="/register?role=client" className="lp-nav-link">For Clients</Link>
                    <Link to="/register?role=candidate" className="lp-nav-link">For Developers</Link>
                    <a href="#pricing" className="lp-nav-link">Pricing</a>
                </nav>
                <div className="lp-nav-actions">
                    <button className="lp-theme-toggle" onClick={toggleTheme}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            {theme === 'light' ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>
                    <Link to="/login" className="lp-login">Login</Link>
                    <Link to="/register?role=candidate" className="lp-btn-primary">Get Started</Link>
                </div>
            </header>

            <main className="lp-main">
                {/* ── HERO ── */}
                <section className="lp-hero">
                    <div className="lp-hero-copy">
                        <div className="lp-badge">
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>how_to_reg</span>
                            <span className="lp-badge-text">Structured Candidate Data</span>
                        </div>
                        <h1 className="lp-h1">
                            Hire Faster<br />
                            With Structured<br />
                            <span className="lp-h1-grad">Candidate Data</span>
                        </h1>
                        <p className="lp-tagline">
                            Collect complete candidate profiles, post jobs, and manage applicants — all in one simple platform.
                        </p>
                        <div className="lp-cta-row">
                            <Link to="/register?role=client" className="lp-btn-primary lp-btn-hero">
                                Post a Job
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                            </Link>
                            <Link to="/register?role=candidate" className="lp-btn-secondary lp-btn-hero">Get Started</Link>
                        </div>
                        <div className="lp-social-proof">
                            <div className="lp-avatars">
                                {[['AC', 'var(--color-primary)'], ['EL', 'var(--color-text-muted)'], ['RK', 'var(--color-text-subtle)']].map(([l, c], i) => (
                                    <div key={i} className="lp-av" style={{ background: c, color: 'var(--color-bg)', zIndex: 3 - i }}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <span className="lp-proof-text">Trusted by <strong>500+</strong> tech teams globally</span>
                        </div>
                    </div>

                    <div className="lp-hero-card-wrap">
                        <div className="lp-glass lp-profile-card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div className="lp-card-header" style={{ paddingBottom: 20 }}>
                                <div className="lp-card-id">
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 22 }}>upcoming</span>
                                    </div>
                                    <div>
                                        <div className="lp-card-name">Phase 2 — Coming Soon</div>
                                        <div className="lp-card-role">Candidate Assessments &amp; Intelligence</div>
                                    </div>
                                </div>
                                <span style={{ padding: '4px 12px', borderRadius: 9999, background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 700, border: '1px solid var(--color-border)', whiteSpace: 'nowrap', fontFamily: "'Manrope', sans-serif" }}>In Development</span>
                            </div>

                            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                                We're building a powerful new layer on top of TopDev — deep skill assessments that give you <strong style={{ color: 'var(--color-text)' }}>verified technical scores</strong> for every candidate, so you hire with full confidence.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { icon: 'psychology', label: 'Skill-based technical assessments' },
                                    { icon: 'insights', label: 'Deep candidate performance insights' },
                                    { icon: 'verified', label: 'Verified competency scores' },
                                    { icon: 'smart_toy', label: 'AI-powered screening & shortlisting' },
                                ].map(({ icon, label }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--color-text)', fontSize: 16 }}>{icon}</span>
                                        </div>
                                        <span style={{ color: 'var(--color-text)', opacity: 0.8, fontSize: 14, fontWeight: 500 }}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 4, padding: '14px 16px', borderRadius: 4, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', display: 'flex', gap: 10 }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--color-text)', fontSize: 18, flexShrink: 0 }}>notifications_active</span>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                                    <strong style={{ color: 'var(--color-text)' }}>Stay tuned.</strong> Assessments &amp; insights are arriving with Phase 2. Early adopters get priority access.
                                </p>
                            </div>
                        </div>

                        <div className="lp-float-badge" style={{ border: '1px solid var(--color-border)' }}>
                            <div className="lp-float-icon">
                                <span className="material-symbols-outlined" style={{ color: 'var(--color-text)', fontSize: 16 }}>rocket_launch</span>
                            </div>
                            <div>
                                <div className="lp-float-title">Phase 2 Launching Soon</div>
                                <div className="lp-float-sub">Assessments &amp; deeper insights</div>
                            </div>
                        </div>

                        <div className="lp-float-stat">
                            <div className="lp-stat-label">Per Hire</div>
                            <div className="lp-stat-val">15<span className="lp-stat-unit">%</span></div>
                        </div>
                    </div>
                </section>

                {/* ── TRUSTED BY ── */}
                <div className="lp-trusted">
                    <div className="lp-trusted-inner">
                        <p className="lp-trusted-label">Trusted by 500+ tech teams</p>
                        <div className="lp-logos">
                            {[['layers', 'ACME Corp'], ['rocket_launch', 'NovaTech'], ['all_inclusive', 'Quantum'], ['bolt', 'Zenith'], ['language', 'Global.io']].map(([icon, name]) => (
                                <div key={name} className="lp-logo-item">
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── PROBLEM ── */}
                <section id="problem" className="lp-problem">
                    <div className="lp-section-hd">
                        <h2 className="lp-h2">Traditional Hiring Is <span className="lp-h2-purple">Incomplete</span></h2>
                        <p className="lp-subtext">Recruiters struggle with fragmented profiles, missing details, and slow manual verification. TopDev brings structure to the hiring process.</p>
                    </div>
                    <div className="lp-cards3">
                        {[
                            { icon: 'data_object', title: 'Incomplete Candidate Data', desc: 'Recruiters waste hours chasing missing contact info, resumes, and specific skill details from fragmented applications.' },
                            { icon: 'history_toggle_off', title: 'Screening Takes Too Long', desc: 'Manual review of non-standardized resumes is a bottleneck. It takes days just to decide who is worth a first call.' },
                            { icon: 'person_search', title: 'Unqualified Applicant Noise', desc: 'High volume of applicants without verified experience makes it impossible to find high-quality talent quickly.' },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="lp-card">
                                <div className="lp-card-icon">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 28 }}>{icon}</span>
                                </div>
                                <h3 className="lp-card-h">{title}</h3>
                                <p className="lp-card-p">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── PROCESS ── */}
                <section id="features" className="lp-process">
                    <div className="lp-section-hd">
                        <div className="lp-badge" style={{ margin: '0 auto 32px' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>featured_play_list</span>
                            <span className="lp-badge-text">Core Features</span>
                        </div>
                        <h2 className="lp-h2">Simplicity First.<br /><span className="lp-h2-grad">Recruitment Redefined.</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 24 }}>Structured data collection and clean applicant management. No buzzwords, just results.</p>
                    </div>
                    <div className="lp-process-cards">
                        {/* For Recruiters */}
                        <div className="lp-proc-card">
                            <div className="lp-step-num">R</div>
                            <div className="lp-proc-body">
                                <h3 className="lp-proc-h">For Recruiters</h3>
                                <p className="lp-proc-p">Streamline your hiring funnel with tools built for speed and clarity.</p>
                                <ul className="lp-features" style={{ marginBottom: 32 }}>
                                    {['Post jobs with ease', 'View complete candidate profiles', 'Filter by experience & salary'].map(f => (
                                        <li key={f} className="lp-feature">
                                            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 18 }}>check_circle</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="lp-upload-vis">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 40 }}>post_add</span>
                                    <div className="lp-upload-label">Create a Job Post</div>
                                    <div className="lp-upload-sub">Simple, structured JDs</div>
                                </div>
                            </div>
                        </div>

                        {/* For Candidates */}
                        <div className="lp-proc-card">
                            <div className="lp-step-num">C</div>
                            <div className="lp-proc-body">
                                <h3 className="lp-proc-h">For Candidates</h3>
                                <p className="lp-proc-p">Stand out with a professional profile that speaks for itself.</p>
                                <ul className="lp-features" style={{ marginBottom: 32 }}>
                                    {['Create detailed profile', 'Upload resume', 'Apply to relevant jobs'].map(f => (
                                        <li key={f} className="lp-feature">
                                            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 18 }}>account_circle</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="lp-proc-vis lp-result-vis">
                                    <div className="lp-mini-profile" style={{ marginBottom: 0 }}>
                                        <div className="lp-mini-av">JD</div>
                                        <div>
                                            <div className="lp-mini-name">John Doe</div>
                                            <div className="lp-mini-role">Backend Engineer</div>
                                        </div>
                                        <span className="lp-mini-badge">Profile 100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* For Teams */}
                        <div className="lp-proc-card">
                            <div className="lp-step-num">T</div>
                            <div className="lp-proc-body">
                                <h3 className="lp-proc-h">Better Management</h3>
                                <p className="lp-proc-p">Keep your entire pipeline organized in one single place.</p>
                                <div className="lp-upload-vis" style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 40 }}>dashboard_customize</span>
                                    <div className="lp-upload-label">Clean Pipeline View</div>
                                    <div className="lp-upload-sub">Track every stage visually</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section id="how-it-works" className="lp-process" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <div className="lp-section-hd">
                        <h2 className="lp-h2">Simple 3-Step Flow</h2>
                        <p className="lp-subtext">Everything you need, nothing you don't. Designed for speed.</p>
                    </div>
                    
                    <div className="lp-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 64 }}>
                        {/* Candidates Flow */}
                        <div className="lp-glass" style={{ padding: 40 }}>
                            <h3 className="lp-proc-h" style={{ fontSize: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--color-text)' }}>person</span>
                                For Candidates
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { step: 1, title: 'Complete Your Profile', desc: 'Sign up and provide verified skills, resume, and contact details.' },
                                    { step: 2, title: 'Browse Relevant Jobs', desc: 'Find IT roles that match your experience and salary expectations.' },
                                    { step: 3, title: 'Apply with One Click', desc: 'Submit your structured data directly to recruiters.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0, justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'var(--color-text)', fontSize: 16, fontWeight: 700, margin: '0 0 4px', fontFamily: "'Manrope', sans-serif" }}>{s.title}</h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recruiters Flow */}
                        <div className="lp-glass" style={{ padding: 40 }}>
                            <h3 className="lp-proc-h" style={{ fontSize: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)' }}>business</span>
                                For Recruiters
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { step: 1, title: 'Post a Job', desc: 'Define your role requirements in seconds with our simple editor.' },
                                    { step: 2, title: 'Receive Applicants', desc: 'Get notified as relevant candidates apply to your job.' },
                                    { step: 3, title: 'Review Profiles', desc: 'See structured, standardized data for every candidate instantly.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0, justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'var(--color-text)', fontSize: 16, fontWeight: 700, margin: '0 0 4px', fontFamily: "'Manrope', sans-serif" }}>{s.title}</h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── PRICING ── */}
                <section id="pricing" className="lp-pricing">
                    <div className="lp-section-hd">
                        <h2 className="lp-h2">Simple, Transparent<br /><span style={{ color: 'var(--color-text-subtle)' }}>Pricing</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 24 }}>No subscriptions, no hidden fees. Pay only for results.</p>
                    </div>
                    <div className="lp-plans">
                        {/* 15% Per Hire */}
                        <div className="lp-plan lp-plan-featured">
                            <div className="lp-popular-badge">Standard</div>
                            <div><p className="lp-plan-name">Pay Per Hire</p><p className="lp-plan-desc">Only pay when you make a successful hire. No upfront costs, no monthly commitments.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price">15</span><span className="lp-price-unit" style={{ fontSize: 24, fontWeight: 700 }}>%</span>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 8 }}>of first-year salary, per successful hire</div>
                            </div>
                            <ul className="lp-features">
                                {['Post unlimited jobs', 'View full candidate profiles', 'Clean applicant management', 'Email support'].map(feature => (
                                    <li key={feature} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: 'var(--color-primary)', fontSize: 20, flexShrink: 0 }}>check_circle</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register?role=client" className="lp-plan-btn lp-plan-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Get Started</Link>
                        </div>

                        {/* Custom / Contact Us */}
                        <div className="lp-plan">
                            <div><p className="lp-plan-name">Custom Pricing</p><p className="lp-plan-desc">Have specific requirements or hiring at scale? We'll build a plan around your needs.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price" style={{ fontSize: 36 }}>Contact Us</span>
                                <div style={{ color: 'var(--color-text-subtle)', fontSize: 13, marginTop: 8 }}>Tailored pricing for your organization</div>
                            </div>
                            <ul className="lp-features">
                                {['Volume hiring discounts', 'Dedicated account manager', 'SLA & priority support', 'Custom contract & invoicing'].map(feature => (
                                    <li key={feature} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ color: 'var(--color-text-subtle)', fontSize: 18, flexShrink: 0 }}>check</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a href="mailto:hello@topdev.io" className="lp-plan-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Contact Us</a>
                        </div>
                    </div>
                </section>

                {/* ── COMING SOON ── */}
                <section id="roadmap" className="lp-process" style={{ padding: '80px 48px' }}>
                    <div className="lp-section-hd" style={{ marginBottom: 48 }}>
                        <div className="lp-badge" style={{ margin: '0 auto 24px' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>rocket_launch</span>
                            <span className="lp-badge-text">Coming Soon</span>
                        </div>
                        <h2 className="lp-h2">Candidate <span style={{ color: 'var(--color-text-muted)' }}>Assessments</span> Are Coming</h2>
                        <p className="lp-subtext" style={{ marginTop: 16 }}>We're building skill assessments directly into TopDev. Verify candidates before the first interview.</p>
                    </div>
                    <div className="lp-cards3">
                        {[
                            { icon: 'psychology',   title: 'Skill Assessments',     desc: 'Role-specific technical tests to verify what candidates actually know.' },
                            { icon: 'insights',     title: 'Performance Insights',   desc: 'Structured score breakdowns for every candidate, at a glance.' },
                            { icon: 'auto_awesome', title: 'Smart Shortlisting',     desc: 'AI-ranked candidates matched to your job requirements.' },
                        ].map((item) => (
                            <div key={item.title} className="lp-card" style={{ borderStyle: 'dashed', borderColor: 'var(--color-border)' }}>
                                <div className="lp-card-icon" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-subtle)' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-text-muted)', fontSize: 26 }}>{item.icon}</span>
                                </div>
                                <h3 className="lp-card-h">{item.title}</h3>
                                <p className="lp-card-p">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <div className="lp-cta-wrap">
                    <div className="lp-cta-box">
                        <div className="lp-cta-copy">
                            <h2 className="lp-cta-h">Ready to find your next hire?</h2>
                            <p className="lp-cta-sub">Stop chasing incomplete data. Start hiring with clarity.</p>
                        </div>
                        <div className="lp-cta-action" style={{ display: 'flex', gap: 16 }}>
                            <Link to="/register?role=client" className="lp-btn-white">
                                Start Hiring
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="lp-footer">
                <div className="lp-footer-inner">
                    <div className="lp-footer-grid">
                        <div className="lp-footer-brand">
                            <div className="lp-logo">
                                <div className="lp-logo-icon">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--color-bg)', fontSize: 18, lineHeight: 1 }}>bolt</span>
                                </div>
                                <span className="lp-logo-text">TopDev</span>
                            </div>
                            <p>The efficient platform connecting the world's best engineers with top tech companies through structured data.</p>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Product</div>
                            <ul className="lp-footer-links">
                                {[
                                    { name: 'For Recruiters', link: '#features' },
                                    { name: 'For Candidates', link: '#features' },
                                    { name: 'How It Works', link: '#how-it-works' },
                                    { name: 'Pricing', link: '#pricing' },
                                    { name: 'Roadmap', link: '#roadmap' }
                                ].map(l => <li key={l.name}><a href={l.link}>{l.name}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Company</div>
                            <ul className="lp-footer-links">
                                {['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'].map(l => <li key={l}><a href="#">{l}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <div className="lp-footer-col-h">Legal</div>
                            <ul className="lp-footer-links">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map(l => <li key={l}><a href="#">{l}</a></li>)}
                            </ul>
                        </div>
                    </div>
                <div className="lp-footer-bottom">
                    <span className="lp-copyright">© 2026 TopDev. All rights reserved.</span>
                    <div className="lp-social">
                        <a href="#" aria-label="Twitter"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>share</span></a>
                        <a href="#" aria-label="LinkedIn"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>group</span></a>
                        <a href="#" aria-label="GitHub"><span className="material-symbols-outlined" style={{ fontSize: 20 }}>code</span></a>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}
