import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div style={{ background: '#080b12', color: '#e2e8f0', minHeight: '100vh', position: 'relative', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                .lp-grid {
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 64px 64px;
                    position: fixed; inset: 0; pointer-events: none; z-index: 0;
                    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 80%);
                    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 80%);
                }
                .lp-orb-l { position: fixed; width: 700px; height: 700px; background: radial-gradient(circle, rgba(13,89,242,0.12) 0%, transparent 70%); top: -200px; left: -200px; z-index: 0; pointer-events: none; }
                .lp-orb-r { position: fixed; width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%); top: 20%; right: -200px; z-index: 0; pointer-events: none; }

                .lp-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(8,11,18,0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 14px 48px;
                }
                .lp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
                .lp-logo-icon { width: 32px; height: 32px; border-radius: 50%; background: #0d59f2; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(13,89,242,0.5); flex-shrink: 0; }
                .lp-logo-text { color: white; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }

                .lp-nav-links { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); padding: 6px 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.08); }
                .lp-nav-link { color: #94a3b8; font-size: 14px; font-weight: 500; padding: 6px 16px; border-radius: 999px; text-decoration: none; transition: all 0.2s; }
                .lp-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
                .lp-nav-actions { display: flex; align-items: center; gap: 20px; }
                .lp-login { color: #94a3b8; font-size: 14px; text-decoration: none; transition: color 0.2s; }
                .lp-login:hover { color: white; }
                .lp-btn-primary { background: #0d59f2; border: 1px solid rgba(13,89,242,0.8); box-shadow: 0 0 25px rgba(13,89,242,0.5); color: white; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px; }
                .lp-btn-primary:hover { background: #1a67f5; box-shadow: 0 0 40px rgba(13,89,242,0.8); transform: translateY(-1px); }
                .lp-btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 999px; text-decoration: none; transition: all 0.2s; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
                .lp-btn-secondary:hover { background: rgba(255,255,255,0.1); }

                .lp-main { position: relative; z-index: 1; }
                .lp-section { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 48px; }

                /* Hero */
                .lp-hero { display: flex; align-items: center; gap: 64px; padding: 112px 48px 96px; max-width: 1200px; margin: 0 auto; }
                .lp-hero-copy { flex: 1; display: flex; flex-direction: column; gap: 28px; }
                .lp-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(13,89,242,0.3); background: linear-gradient(90deg, rgba(13,89,242,0.15), rgba(13,89,242,0.2), rgba(13,89,242,0.15)); background-size: 200% 100%; animation: shimmer 3s linear infinite; width: fit-content; }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                .lp-badge-text { color: #6badf7; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
                .lp-h1 { font-size: clamp(52px, 6vw, 82px); font-weight: 900; line-height: 1.02; letter-spacing: -2px; margin: 0; color: white; }
                .lp-h1-dim { color: #94a3b8; }
                .lp-h1-grad { background: linear-gradient(135deg, #4d8ef5, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .lp-tagline { color: #94a3b8; font-size: 18px; font-weight: 300; line-height: 1.7; max-width: 480px; margin: 0; }
                .lp-cta-row { display: flex; flex-wrap: wrap; gap: 16px; }
                .lp-btn-hero { font-size: 16px; padding: 16px 32px; }
                .lp-social-proof { display: flex; align-items: center; gap: 16px; }
                .lp-avatars { display: flex; }
                .lp-av { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; border: 2px solid #080b12; margin-left: -8px; }
                .lp-av:first-child { margin-left: 0; }
                .lp-proof-text { color: #94a3b8; font-size: 14px; }
                .lp-proof-text strong { color: white; }

                /* Hero card */
                .lp-hero-card-wrap { flex-shrink: 0; width: 420px; position: relative; }
                .lp-glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 16px; }
                .lp-profile-card { padding: 24px; animation: floatY 5s ease-in-out infinite; }
                @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                .lp-card-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
                .lp-card-id { display: flex; align-items: center; gap: 16px; }
                .lp-avatar-lg { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #0d59f2, #6badf7); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; color: white; box-shadow: 0 0 20px rgba(13,89,242,0.4); }
                .lp-card-name { color: white; font-weight: 600; font-size: 18px; }
                .lp-card-role { color: #94a3b8; font-size: 12px; margin-top: 2px; }
                .lp-badge-green { padding: 4px 12px; border-radius: 999px; background: rgba(0,255,102,0.08); color: #00ff66; font-size: 12px; font-weight: 700; border: 1px solid rgba(0,255,102,0.2); }
                .lp-scores { display: flex; flex-direction: column; gap: 20px; }
                .lp-score-row { display: flex; flex-direction: column; gap: 8px; }
                .lp-score-label { display: flex; justify-content: space-between; }
                .lp-score-name { color: #cbd5e1; font-size: 14px; font-weight: 500; }
                .lp-score-val { color: white; font-size: 14px; font-weight: 700; }
                .lp-score-track { height: 3px; background: rgba(255,255,255,0.05); border-radius: 999px; overflow: hidden; }
                .lp-score-fill { height: 100%; background: linear-gradient(90deg, #0d59f2, #6badf7); border-radius: 999px; box-shadow: 0 0 8px rgba(13,89,242,0.5); }
                .lp-ai-note { margin-top: 24px; padding: 16px; border-radius: 12px; background: rgba(13,89,242,0.08); border: 1px solid rgba(13,89,242,0.15); display: flex; gap: 12px; }
                .lp-ai-text { color: #94a3b8; font-size: 12px; line-height: 1.6; }
                .lp-ai-text strong { color: white; font-weight: 500; }
                .lp-float-badge { position: absolute; bottom: -32px; left: -24px; padding: 16px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: floatY 7s ease-in-out infinite 1s; }
                .lp-float-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(0,255,102,0.1); border: 1px solid rgba(0,255,102,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lp-float-title { color: white; font-size: 14px; font-weight: 700; }
                .lp-float-sub { color: #94a3b8; font-size: 12px; margin-top: 2px; }
                .lp-float-stat { position: absolute; top: -24px; right: -16px; padding: 12px 16px; border-radius: 12px; animation: floatY 5s ease-in-out infinite 0.5s; }
                .lp-stat-label { color: #94a3b8; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
                .lp-stat-val { color: white; font-size: 22px; font-weight: 900; }
                .lp-stat-unit { color: #0d59f2; font-size: 14px; font-weight: 600; }

                /* Trusted by strip */
                .lp-trusted { border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 40px 48px; }
                .lp-trusted-inner { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 32px; }
                .lp-trusted-label { color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; }
                .lp-logos { display: flex; flex-wrap: wrap; justify-content: center; gap: 40px; opacity: 0.5; }
                .lp-logo-item { display: flex; align-items: center; gap: 8px; color: white; font-size: 18px; font-weight: 700; }

                /* Problem section */
                .lp-problem { padding: 112px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-section-hd { text-align: center; margin-bottom: 64px; }
                .lp-h2 { font-size: clamp(36px, 4vw, 48px); font-weight: 900; letter-spacing: -1px; color: white; margin: 0 0 20px; }
                .lp-h2-purple { color: #8b5cf6; }
                .lp-subtext { color: #94a3b8; font-size: 18px; font-weight: 300; line-height: 1.7; max-width: 640px; margin: 0 auto; }
                .lp-cards3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
                .lp-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 32px; transition: border-color 0.3s, box-shadow 0.3s; }
                .lp-card:hover { border-color: rgba(139,92,246,0.3); box-shadow: 0 0 30px rgba(139,92,246,0.08); }
                .lp-card-icon { width: 56px; height: 56px; background: #231a3b; border: 1px solid #3b2d5a; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
                .lp-card-h { color: white; font-size: 20px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.3px; }
                .lp-card-p { color: #94a3b8; font-size: 15px; line-height: 1.65; margin: 0; font-weight: 300; }

                /* Process section */
                .lp-process { padding: 96px 48px; max-width: 1280px; margin: 0 auto; }
                .lp-h2-grad { background: linear-gradient(135deg, #0d59f2, #6badf7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
                .lp-process-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; position: relative; margin-top: 80px; }
                .lp-connector { position: absolute; top: 28px; left: 16%; right: 16%; height: 1px; background: linear-gradient(90deg,transparent,rgba(13,89,242,0.4),transparent); z-index: 0; }
                .lp-proc-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; display: flex; flex-direction: column; position: relative; z-index: 1; overflow: hidden; transition: border-color 0.3s, box-shadow 0.3s; }
                .lp-proc-card:hover { border-color: rgba(13,89,242,0.35); box-shadow: 0 0 30px rgba(13,89,242,0.08); }
                .lp-step-num { position: absolute; top: 0; left: 0; width: 56px; height: 56px; background: #080b12; border-right: 1px solid rgba(13,89,242,0.3); border-bottom: 1px solid rgba(13,89,242,0.3); border-radius: 0 0 16px 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #0d59f2; z-index: 2; }
                .lp-proc-body { padding: 80px 32px 32px; display: flex; flex-direction: column; flex: 1; }
                .lp-proc-h { color: white; font-size: 20px; font-weight: 700; margin: 0 0 12px; }
                .lp-proc-p { color: #94a3b8; font-size: 15px; line-height: 1.65; font-weight: 300; margin: 0 0 32px; }
                .lp-proc-vis { margin-top: auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
                .lp-upload-vis { background: rgba(13,89,242,0.05); border: 2px dashed rgba(13,89,242,0.3); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; }
                .lp-upload-vis:hover { background: rgba(13,89,242,0.1); }
                .lp-upload-label { color: white; font-size: 13px; font-weight: 700; margin-top: 12px; }
                .lp-upload-sub { color: #475569; font-size: 12px; margin-top: 4px; }
                .lp-code-vis { background: #0a0d14; }
                .lp-code-titlebar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); background: #0f1420; }
                .lp-dots { display: flex; gap: 6px; }
                .lp-dot { width: 10px; height: 10px; border-radius: 50%; }
                .lp-code-filename { color: #475569; font-size: 11px; font-family: monospace; flex: 1; text-align: center; }
                .lp-code-body { padding: 16px; font-family: monospace; color: #0d59f2; font-size: 11px; line-height: 1.7; white-space: pre; overflow: hidden; }
                .lp-result-vis { background: #0f1420; padding: 20px; }
                .lp-mini-profile { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
                .lp-mini-av { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#10b981,#059669); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 13px; flex-shrink: 0; }
                .lp-mini-name { color: white; font-size: 14px; font-weight: 700; }
                .lp-mini-role { color: #475569; font-size: 11px; margin-top: 2px; }
                .lp-mini-badge { margin-left: auto; padding: 2px 8px; border-radius: 4px; background: rgba(16,185,129,0.1); color: #10b981; font-size: 10px; font-weight: 700; border: 1px solid rgba(16,185,129,0.2); text-transform: uppercase; }
                .lp-mini-scores { display: flex; flex-direction: column; gap: 10px; }
                .lp-mini-score-row { display: flex; flex-direction: column; gap: 5px; }
                .lp-mini-score-label { display: flex; justify-content: space-between; }
                .lp-mini-score-name { color: #94a3b8; font-size: 11px; }
                .lp-mini-score-val { color: white; font-size: 11px; font-weight: 700; }
                .lp-mini-track { height: 3px; background: rgba(255,255,255,0.05); border-radius: 999px; overflow: hidden; }

                /* Pricing section */
                .lp-pricing { padding: 96px 48px; max-width: 1200px; margin: 0 auto; }
                .lp-plans { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; align-items: end; margin-top: 64px; }
                .lp-plan { background: #0d1020; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; height: 510px; transition: border-color 0.3s; }
                .lp-plan:hover { border-color: rgba(255,255,255,0.12); }
                .lp-plan-featured { border-color: #0d59f2 !important; box-shadow: 0 0 40px rgba(13,89,242,0.15); height: 560px; transform: translateY(-16px); position: relative; }
                .lp-popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #0d59f2; color: white; font-size: 10px; font-weight: 900; padding: 6px 20px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.15em; box-shadow: 0 4px 15px rgba(13,89,242,0.4); white-space: nowrap; }
                .lp-plan-name { color: white; font-size: 20px; font-weight: 700; margin: 0 0 8px; }
                .lp-plan-featured .lp-plan-name { font-size: 24px; font-weight: 900; margin-top: 16px; }
                .lp-plan-desc { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 32px; }
                .lp-plan-featured .lp-plan-desc { color: #cbd5e1; }
                .lp-price { font-size: 48px; font-weight: 900; color: white; }
                .lp-price-unit { font-size: 14px; font-weight: 500; color: #94a3b8; margin-left: 8px; }
                .lp-price-mb { margin-bottom: 32px; }
                .lp-features { list-style: none; padding: 0; margin: 0 0 auto; display: flex; flex-direction: column; gap: 16px; }
                .lp-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #94a3b8; }
                .lp-plan-featured .lp-feature { color: white; font-weight: 500; }
                .lp-plan-btn { margin-top: 32px; border-radius: 999px; height: 48px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white; }
                .lp-plan-btn:hover { background: rgba(255,255,255,0.1); }
                .lp-plan-btn-primary { height: 56px; background: #0d59f2; border: 1px solid rgba(13,89,242,0.8); box-shadow: 0 0 25px rgba(13,89,242,0.4); color: white; font-weight: 700; font-size: 14px; }
                .lp-plan-btn-primary:hover { background: #1a67f5; box-shadow: 0 0 40px rgba(13,89,242,0.6); transform: translateY(-1px); }

                /* CTA */
                .lp-cta-wrap { max-width: 1000px; margin: 0 auto; padding: 0 48px 128px; }
                .lp-cta-box { background: linear-gradient(135deg, #0d1020 0%, #0f1830 50%, #0d1020 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 64px; display: flex; align-items: center; justify-content: space-between; gap: 32px; position: relative; overflow: hidden; }
                .lp-cta-glow-l { position: absolute; top: -40px; right: -40px; width: 384px; height: 384px; background: rgba(13,89,242,0.15); filter: blur(120px); border-radius: 50%; pointer-events: none; mix-blend-mode: screen; }
                .lp-cta-glow-r { position: absolute; bottom: -20px; left: -20px; width: 256px; height: 256px; background: rgba(139,92,246,0.1); filter: blur(80px); border-radius: 50%; pointer-events: none; mix-blend-mode: screen; }
                .lp-cta-copy { position: relative; z-index: 1; }
                .lp-cta-h { color: white; font-size: clamp(24px, 3vw, 36px); font-weight: 900; margin: 0 0 12px; }
                .lp-cta-sub { color: #94a3b8; font-size: 18px; margin: 0; }
                .lp-cta-action { position: relative; z-index: 1; flex-shrink: 0; }
                .lp-btn-white { display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; border-radius: 999px; background: white; color: black; font-size: 14px; font-weight: 900; text-decoration: none; box-shadow: 0 20px 40px rgba(0,0,0,0.3); white-space: nowrap; transition: background 0.2s; }
                .lp-btn-white:hover { background: #e2e8f0; }

                /* Footer */
                .lp-footer { border-top: 1px solid rgba(255,255,255,0.06); background: #060810; padding: 64px 48px 32px; }
                .lp-footer-inner { max-width: 1200px; margin: 0 auto; }
                .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 64px; }
                .lp-footer-brand p { color: #94a3b8; font-size: 15px; line-height: 1.6; max-width: 280px; margin: 20px 0 0; }
                .lp-footer-col-h { color: white; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; }
                .lp-footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
                .lp-footer-links a { color: #94a3b8; font-size: 14px; text-decoration: none; transition: color 0.2s; }
                .lp-footer-links a:hover { color: white; }
                .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 32px; display: flex; align-items: center; justify-content: space-between; }
                .lp-copyright { color: #475569; font-size: 14px; }
                .lp-social { display: flex; align-items: center; gap: 20px; }
                .lp-social a { color: #475569; transition: color 0.2s; text-decoration: none; }
                .lp-social a:hover { color: white; }

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

            <div className="lp-grid"></div>
            <div className="lp-orb-l"></div>
            <div className="lp-orb-r"></div>

            {/* ── NAVBAR ── */}
            <header className="lp-nav">
                <Link to="/" className="lp-logo">
                    <div className="lp-logo-icon">
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 18, lineHeight: 1 }}>bolt</span>
                    </div>
                    <span className="lp-logo-text">TopDev</span>
                </Link>
                <nav className="lp-nav-links">
                    <a href="#features" className="lp-nav-link">For Clients</a>
                    <a href="#how-it-works" className="lp-nav-link">For Developers</a>
                    <a href="#pricing" className="lp-nav-link">Pricing</a>
                </nav>
                <div className="lp-nav-actions">
                    <Link to="/login" className="lp-login">Login</Link>
                    <Link to="/register?role=candidate" className="lp-btn-primary">Get Started</Link>
                </div>
            </header>

            <main className="lp-main">
                {/* ── HERO ── */}
                <section className="lp-hero">
                    <div className="lp-hero-copy">
                        <div className="lp-badge">
                            <span className="material-symbols-outlined" style={{ color: '#6badf7', fontSize: 16 }}>how_to_reg</span>
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
                                {[['AC', '#0d59f2', '#0a2e78'], ['EL', '#8b5cf6', '#3b1d7a'], ['RK', '#10b981', '#0a3d2a']].map(([l, a, b], i) => (
                                    <div key={i} className="lp-av" style={{ background: `linear-gradient(135deg, ${a}33, ${b}66)`, border: `2px solid #080b12`, color: a, zIndex: 3 - i }}>
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
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
                                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 22 }}>upcoming</span>
                                    </div>
                                    <div>
                                        <div className="lp-card-name">Phase 2 — Coming Soon</div>
                                        <div className="lp-card-role">Candidate Assessments &amp; Intelligence</div>
                                    </div>
                                </div>
                                <span style={{ padding: '4px 12px', borderRadius: 999, background: 'rgba(139,92,246,0.12)', color: '#a78bfa', fontSize: 11, fontWeight: 700, border: '1px solid rgba(139,92,246,0.25)', whiteSpace: 'nowrap' }}>In Development</span>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                                We're building a powerful new layer on top of TopDev — deep skill assessments that give you <strong style={{ color: '#e2e8f0' }}>verified technical scores</strong> for every candidate, so you hire with full confidence.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { icon: 'psychology', label: 'Skill-based technical assessments' },
                                    { icon: 'insights', label: 'Deep candidate performance insights' },
                                    { icon: 'verified', label: 'Verified competency scores' },
                                    { icon: 'smart_toy', label: 'AI-powered screening & shortlisting' },
                                ].map(({ icon, label }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: 16 }}>{icon}</span>
                                        </div>
                                        <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 4, padding: '14px 16px', borderRadius: 12, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', gap: 10 }}>
                                <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: 18, flexShrink: 0 }}>notifications_active</span>
                                <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                                    <strong style={{ color: 'white' }}>Stay tuned.</strong> Assessments &amp; insights are arriving with Phase 2. Early adopters get priority access.
                                </p>
                            </div>
                        </div>

                        <div className="lp-glass lp-float-badge">
                            <div className="lp-float-icon">
                                <span className="material-symbols-outlined" style={{ color: '#00ff66', fontSize: 16 }}>rocket_launch</span>
                            </div>
                            <div>
                                <div className="lp-float-title">Phase 2 Launching Soon</div>
                                <div className="lp-float-sub">Assessments &amp; deeper insights</div>
                            </div>
                        </div>

                        <div className="lp-glass lp-float-stat">
                            <div className="lp-stat-label">Per Hire</div>
                            <div className="lp-stat-val">15<span className="lp-stat-unit">%</span></div>
                        </div>
                    </div>
                </section>

                {/* ── TRUSTED BY ── */}
                <div className="lp-trusted">
                    <div className="lp-trusted-inner">
                        <p className="lp-trusted-label">Trusted by 500+ elite tech teams</p>
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
                                    <span className="material-symbols-outlined" style={{ color: '#8b5cf6', fontSize: 28 }}>{icon}</span>
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
                            <span className="material-symbols-outlined" style={{ color: '#6badf7', fontSize: 16 }}>featured_play_list</span>
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
                                            <span className="material-symbols-outlined" style={{ color: '#0d59f2', fontSize: 18 }}>check_circle</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="lp-upload-vis">
                                    <span className="material-symbols-outlined" style={{ color: '#0d59f2', fontSize: 40 }}>post_add</span>
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
                                            <span className="material-symbols-outlined" style={{ color: '#0d59f2', fontSize: 18 }}>account_circle</span>
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
                                        <span className="lp-mini-badge" style={{ background: 'rgba(13,89,242,0.1)', color: '#0d59f2', border: '1px solid rgba(13,89,242,0.2)' }}>Profile 100%</span>
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
                                <div className="lp-upload-vis" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#6badf7', fontSize: 40 }}>dashboard_customize</span>
                                    <div className="lp-upload-label">Clean Pipeline View</div>
                                    <div className="lp-upload-sub">Track every stage visually</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section id="how-it-works" className="lp-process" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div className="lp-section-hd">
                        <h2 className="lp-h2">Simple 3-Step Flow</h2>
                        <p className="lp-subtext">Everything you need, nothing you don't. Designed for speed.</p>
                    </div>
                    
                    <div className="lp-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginTop: 64 }}>
                        {/* Candidates Flow */}
                        <div className="lp-glass" style={{ padding: 40 }}>
                            <h3 className="lp-proc-h" style={{ fontSize: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="material-symbols-outlined" style={{ color: '#0d59f2' }}>person</span>
                                For Candidates
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { step: 1, title: 'Complete Your Profile', desc: 'Sign up and provide verified skills, resume, and contact details.' },
                                    { step: 2, title: 'Browse Relevant Jobs', desc: 'Find IT roles that match your experience and salary expectations.' },
                                    { step: 3, title: 'Apply with One Click', desc: 'Submit your structured data directly to recruiters.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(13,89,242,0.1)', color: '#0d59f2', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0, justifyContent: 'center' }}>
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{s.title}</h4>
                                            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recruiters Flow */}
                        <div className="lp-glass" style={{ padding: 40 }}>
                            <h3 className="lp-proc-h" style={{ fontSize: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="material-symbols-outlined" style={{ color: '#8b5cf6' }}>business</span>
                                For Recruiters
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    { step: 1, title: 'Post a Job', desc: 'Define your role requirements in seconds with our simple editor.' },
                                    { step: 2, title: 'Receive Applicants', desc: 'Get notified as relevant candidates apply to your job.' },
                                    { step: 3, title: 'Review Profiles', desc: 'See structured, standardized data for every candidate instantly.' }
                                ].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 20 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0, justifyContent: 'center' }}>
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{s.title}</h4>
                                            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
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
                        <h2 className="lp-h2">Simple, Transparent<br /><span style={{ color: '#64748b' }}>Pricing</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 24 }}>Find the perfect fit for your hiring needs. No hidden fees.</p>
                    </div>
                    <div className="lp-plans">
                        <div className="lp-plan">
                            <div><p className="lp-plan-name">Pay-Per-Hire</p><p className="lp-plan-desc">Only pay when you make a successful hire. No upfront costs, no monthly commitments.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price">15</span><span className="lp-price-unit" style={{ fontSize: 22, fontWeight: 700 }}>%</span>
                                <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>of first-year salary, per hire</div>
                            </div>
                            <ul className="lp-features">
                                {['Post unlimited jobs', 'View full candidate profiles', 'Clean applicant management', 'Standard email support'].map(f => (
                                    <li key={f} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: 18, flexShrink: 0 }}>check</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register?role=client" className="lp-plan-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Get Started Free</Link>
                        </div>

                        <div className="lp-plan lp-plan-featured">
                            <div className="lp-popular-badge">Most Popular</div>
                            <div><p className="lp-plan-name">Growth</p><p className="lp-plan-desc">For scaling companies that need elite talent quickly and at volume.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price">15</span><span className="lp-price-unit" style={{ fontSize: 22, fontWeight: 700 }}>%</span>
                                <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>per successful hire + priority tools</div>
                            </div>
                            <ul className="lp-features">
                                {['Everything in Pay-Per-Hire', 'Advanced candidate filtering', 'Priority support &amp; onboarding', 'Phase 2 early access (assessments)'].map(f => (
                                    <li key={f} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#0d59f2', fontSize: 20, flexShrink: 0 }}>check_circle</span>
                                        <span dangerouslySetInnerHTML={{ __html: f }} />
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register?role=client" className="lp-plan-btn lp-plan-btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Start 14-Day Free Trial</Link>
                        </div>

                        <div className="lp-plan">
                            <div><p className="lp-plan-name">Enterprise</p><p className="lp-plan-desc">Custom requirements? We'll tailor a pricing model that fits your organization's scale.</p></div>
                            <div className="lp-price-mb">
                                <span className="lp-price" style={{ fontSize: 36 }}>Contact Us</span>
                                <div style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Tailored pricing for your needs</div>
                            </div>
                            <ul className="lp-features">
                                {['Everything in Growth', 'API Access & ATS Integrations', 'SLA & Premium 24/7 Support', 'Custom Contract & Invoicing'].map(f => (
                                    <li key={f} className="lp-feature">
                                        <span className="material-symbols-outlined" style={{ color: '#475569', fontSize: 18, flexShrink: 0 }}>check</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href="mailto:hello@topdev.io" className="lp-plan-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Contact Us</a>
                        </div>
                    </div>
                </section>

                {/* ── COMING SOON — PHASE 2 ── */}
                <section id="roadmap" className="lp-process" style={{ padding: '80px 48px', position: 'relative' }}>
                    <div className="lp-section-hd" style={{ marginBottom: 56 }}>
                        <div className="lp-badge" style={{ margin: '0 auto 24px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
                            <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: 14 }}>rocket_launch</span>
                            <span className="lp-badge-text" style={{ color: '#a78bfa' }}>Coming Soon — Phase 2</span>
                        </div>
                        <h2 className="lp-h2">The Future of Candidate <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Assessment</span></h2>
                        <p className="lp-subtext" style={{ marginTop: 20 }}>Phase 2 transforms TopDev into an intelligent hiring engine — going beyond profiles to give you verified skill scores, structured technical evaluations, and deep candidate insights before the first interview.</p>
                    </div>

                    <div className="lp-cards3">
                        {[
                            {
                                icon: 'psychology',
                                title: 'Candidate Skill Assessments',
                                desc: 'Auto-generated, role-specific technical assessments that evaluate candidates on the skills that actually matter — directly within the platform.',
                                tag: 'Phase 2'
                            },
                            {
                                icon: 'insights',
                                title: 'Deep Performance Insights',
                                desc: 'Go beyond resumes. Get structured, data-driven performance breakdowns for every candidate — skill coverage, response quality, and time efficiency.',
                                tag: 'Phase 2'
                            },
                            {
                                icon: 'auto_awesome',
                                title: 'AI-Powered Smart Shortlisting',
                                desc: 'Let AI rank your applicants against your specific job requirements, so your team spends time only on the candidates who are truly ready.',
                                tag: 'Phase 2'
                            },
                        ].map(({ icon, title, desc, tag }) => (
                            <div key={title} className="lp-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 10px', borderRadius: 999, background: 'rgba(139,92,246,0.12)', color: '#a78bfa', fontSize: 10, fontWeight: 700, border: '1px solid rgba(139,92,246,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tag}</div>
                                <div className="lp-card-icon" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: 26 }}>{icon}</span>
                                </div>
                                <h3 className="lp-card-h" style={{ color: '#e2e8f0' }}>{title}</h3>
                                <p className="lp-card-p">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 56, maxWidth: 640, margin: '56px auto 0', padding: '28px 36px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(139,92,246,0.07),rgba(13,89,242,0.07))', border: '1px solid rgba(139,92,246,0.2)', textAlign: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: 28, display: 'block', marginBottom: 12 }}>notifications_active</span>
                        <h3 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>Be First in Line</h3>
                        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px' }}>Phase 2 is actively in development. Sign up today and get early access to assessments, skill evaluations, and deeper candidate intelligence the moment they launch.</p>
                        <Link to="/register?role=client" className="lp-btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
                            Get Early Access
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                        </Link>
                    </div>
                </section>

                {/* ── CTA ── */}
                <div className="lp-cta-wrap">
                    <div className="lp-cta-box">
                        <div className="lp-cta-glow-l"></div>
                        <div className="lp-cta-glow-r"></div>
                        <div className="lp-cta-copy">
                            <h2 className="lp-cta-h">Ready to find your next hire?</h2>
                            <p className="lp-cta-sub">Stop chasing incomplete data. Start hiring with clarity.</p>
                        </div>
                        <div className="lp-cta-action" style={{ display: 'flex', gap: 16 }}>
                            <Link to="/register?role=client" className="lp-btn-white">
                                Start Hiring
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                            </Link>
                            <Link to="/register?role=candidate" className="lp-btn-secondary" style={{ padding: '16px 32px' }}>
                                Create Your Profile
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
                                    <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 18, lineHeight: 1 }}>bolt</span>
                                </div>
                                <span className="lp-logo-text">TopDev</span>
                            </div>
                            <p>The efficient platform connecting the world's best engineers with elite tech companies through structured data.</p>
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
